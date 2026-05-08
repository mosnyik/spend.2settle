/**
 * Wallet Pool Service
 *
 * Manages a finite pool of deposit wallets.
 *
 * How it works:
 * -------------
 * 1. We have a fixed number of wallets, each with addresses for multiple chains:
 *    - bitcoin: For BTC deposits
 *    - evm: For ETH, BNB, ERC20, BEP20 deposits (same address works on all EVM chains)
 *    - tron: For TRX, TRC20 deposits
 *
 * 2. Each chain has its own availability flag:
 *    - bitcoin_flag, ethereum_flag, binance_flag, tron_flag, erc20_flag, bep20_flag, trc20_flag
 *    - 1 (or 'true') = available
 *    - 0 (or 'false') = in use
 *
 * 3. When a payment starts:
 *    - Find a wallet with the relevant flag = 1
 *    - Set the flag to 0 (mark as in-use)
 *    - Record the assignment time
 *    - Return the wallet address
 *
 * 4. When a payment completes or expires:
 *    - Set the flag back to 1 (mark as available)
 *
 * 5. Safety: If a wallet isn't released (bug, crash), it auto-releases after 5 minutes
 *    based on the last_assigned timestamp.
 *
 * Concurrency:
 * ------------
 * Multiple payments can try to get wallets simultaneously. We use MySQL's
 * `FOR UPDATE` row lock to ensure only one payment gets each wallet.
 *
 * This prevents the race condition where two payments see the same wallet
 * as available and both try to use it.
 */

import { Network, WalletAssignment, DEFAULT_CONFIG } from '../types';
import { WalletPoolEmptyError, DatabaseError } from '../errors';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Network to wallet column mapping.
 *
 * Multiple networks can share the same wallet column:
 * - EVM chains (eth, bnb, erc20, bep20) all use the 'evm' address
 * - TRON chains (trx, trc20) both use the 'tron' address
 */
type WalletColumn = 'bitcoin' | 'evm' | 'tron';

/**
 * Wallet row from the database.
 */
interface WalletRow {
  id: number;
  bitcoin: string | null;
  evm: string | null;
  tron: string | null;

  // Flags (can be string 'true'/'false', number 0/1, or boolean)
  bitcoin_flag: string | number | boolean;
  ethereum_flag: string | number | boolean;
  binance_flag: string | number | boolean;
  tron_flag: string | number | boolean;
  erc20_flag: string | number | boolean;
  bep20_flag: string | number | boolean;
  trc20_flag: string | number | boolean;

  // Last assigned timestamps
  bitcoin_last_assigned: Date | null;
  ethereum_last_assigned: Date | null;
  binance_last_assigned: Date | null;
  tron_last_assigned: Date | null;
  erc20_last_assigned: Date | null;
  bep20_last_assigned: Date | null;
  trc20_last_assigned: Date | null;
}

// =============================================================================
// COLUMN MAPPINGS
// =============================================================================

/**
 * Map network to the wallet address column.
 */
function getWalletColumn(network: Network): WalletColumn {
  switch (network) {
    case 'bitcoin':
      return 'bitcoin';

    // All EVM-compatible networks use the same address
    case 'ethereum':
    case 'bsc':
    case 'polygon':
    case 'base':
    case 'erc20':
    case 'bep20':
      return 'evm';

    // TRON networks use the tron address
    case 'tron':
    case 'trc20':
      return 'tron';
  }
}

/**
 * Map network to the availability flag column.
 *
 * Note: Some networks share a wallet address but have separate flags.
 * This allows a wallet to be used for ETH while still available for BNB.
 */
function getFlagColumn(network: Network): string {
  switch (network) {
    case 'bitcoin':
      return 'bitcoin_flag';
    case 'ethereum':
      return 'ethereum_flag';
    case 'bsc':
      return 'binance_flag';
    case 'tron':
      return 'tron_flag';
    case 'erc20':
      return 'erc20_flag';
    case 'bep20':
      return 'bep20_flag';
    case 'trc20':
      return 'trc20_flag';
    case 'polygon':
      return 'ethereum_flag'; // Share with ethereum for now
    case 'base':
      return 'ethereum_flag'; // Share with ethereum for now
  }
}

/**
 * Map network to the last_assigned timestamp column.
 */
function getLastAssignedColumn(network: Network): string {
  switch (network) {
    case 'bitcoin':
      return 'bitcoin_last_assigned';
    case 'ethereum':
    case 'polygon':
    case 'base':
      return 'ethereum_last_assigned';
    case 'bsc':
      return 'binance_last_assigned';
    case 'tron':
      return 'tron_last_assigned';
    case 'erc20':
      return 'erc20_last_assigned';
    case 'bep20':
      return 'bep20_last_assigned';
    case 'trc20':
      return 'trc20_last_assigned';
  }
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Assign a wallet from the pool for a specific network.
 *
 * This function:
 * 1. Finds an available wallet (flag = true)
 * 2. Locks the row to prevent race conditions
 * 3. Marks it as in-use (flag = false)
 * 4. Records the assignment time
 * 5. Returns the wallet address and ID
 *
 * @param network - The network to get a wallet for
 * @param sessionTtlMinutes - How long the wallet will be held (for expiry calculation)
 * @returns Wallet assignment details
 * @throws WalletPoolEmptyError if no wallets are available
 */
export async function assignWallet(
  network: Network,
  sessionTtlMinutes: number = DEFAULT_CONFIG.sessionTtlMinutes
): Promise<WalletAssignment> {
  // Import pool here to avoid circular dependencies
  const pool = (await import('@/lib/mysql')).default;

  const flagColumn = getFlagColumn(network);
  const walletColumn = getWalletColumn(network);
  const lastAssignedColumn = getLastAssignedColumn(network);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Find an available wallet with row lock
    // The TRIM handles cases where flag might have whitespace
    // The IN clause handles different representations (string, number, boolean)
    const [rows] = await connection.query(
      `SELECT *
       FROM wallets
       WHERE TRIM(${flagColumn}) IN ('true', '1', 1, true)
         AND ${walletColumn} IS NOT NULL
       LIMIT 1
       FOR UPDATE`
    ) as [any[], any];

    if (!rows || rows.length === 0) {
      // No wallets available - check when one might become free
      const estimatedWait = await getEstimatedWaitTime(connection, network);

      await connection.rollback();
      throw new WalletPoolEmptyError(network, estimatedWait);
    }

    const wallet = rows[0] as WalletRow;
    const address = wallet[walletColumn] as string;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + sessionTtlMinutes * 60 * 1000);

    // Mark wallet as in-use
    await connection.query(
      `UPDATE wallets
       SET ${flagColumn} = 0,
           ${lastAssignedColumn} = ?
       WHERE id = ?`,
      [now, wallet.id]
    );

    await connection.commit();

    return {
      address,
      walletId: wallet.id,
      assignedAt: now,
      expiresAt,
    };
  } catch (error) {
    await connection.rollback();

    // Re-throw our custom errors
    if (error instanceof WalletPoolEmptyError) {
      throw error;
    }

    throw new DatabaseError('assignWallet', error instanceof Error ? error : undefined);
  } finally {
    connection.release();
  }
}

/**
 * Release a wallet back to the pool.
 *
 * Called when:
 * - Payment is confirmed (crypto received)
 * - Payment expires (user didn't send)
 * - Payment fails
 *
 * @param walletId - The wallet's database ID
 * @param network - The network to release the flag for
 */
export async function releaseWallet(
  walletId: number,
  network: Network
): Promise<void> {
  const pool = (await import('@/lib/mysql')).default;
  const flagColumn = getFlagColumn(network);

  try {
    await pool.query(
      `UPDATE wallets
       SET ${flagColumn} = 1
       WHERE id = ?`,
      [walletId]
    );
  } catch (error) {
    throw new DatabaseError('releaseWallet', error instanceof Error ? error : undefined);
  }
}

/**
 * Release a wallet by its address (alternative to releaseWallet).
 *
 * Useful when you only have the address, not the wallet ID.
 *
 * @param address - The wallet address
 * @param network - The network to release the flag for
 */
export async function releaseWalletByAddress(
  address: string,
  network: Network
): Promise<void> {
  const pool = (await import('@/lib/mysql')).default;
  const flagColumn = getFlagColumn(network);
  const walletColumn = getWalletColumn(network);

  try {
    await pool.query(
      `UPDATE wallets
       SET ${flagColumn} = 1
       WHERE ${walletColumn} = ?`,
      [address]
    );
  } catch (error) {
    throw new DatabaseError('releaseWalletByAddress', error instanceof Error ? error : undefined);
  }
}

/**
 * Get the estimated wait time until a wallet becomes available.
 *
 * Looks at the oldest assigned wallet and calculates when it will expire.
 *
 * @param connection - Database connection
 * @param network - The network to check
 * @returns Estimated seconds until a wallet is available, or undefined
 */
async function getEstimatedWaitTime(
  connection: any,
  network: Network
): Promise<number | undefined> {
  const lastAssignedColumn = getLastAssignedColumn(network);
  const flagColumn = getFlagColumn(network);

  // Find the oldest assignment that's still in use
  const [rows] = await connection.query(
    `SELECT MIN(${lastAssignedColumn}) as oldest_assigned
     FROM wallets
     WHERE ${flagColumn} IN ('false', '0', 0, false)`
  ) as [any[], any];

  if (!rows || rows.length === 0 || !rows[0].oldest_assigned) {
    return undefined;
  }

  const oldestAssigned = new Date(rows[0].oldest_assigned);
  const expiryTime = oldestAssigned.getTime() + (DEFAULT_CONFIG.sessionTtlMinutes * 60 * 1000);
  const waitMs = expiryTime - Date.now();

  if (waitMs <= 0) {
    // A wallet should be available now (stale assignment)
    return 1; // Return 1 second to trigger a retry
  }

  return Math.ceil(waitMs / 1000); // Convert to seconds
}

/**
 * Get the current status of the wallet pool.
 *
 * Useful for monitoring and dashboards.
 *
 * @returns Pool status for each network
 */
export async function getPoolStatus(): Promise<Record<string, { available: number; inUse: number }>> {
  const pool = (await import('@/lib/mysql')).default;

  const [rows] = await pool.query(`
    SELECT
      SUM(CASE WHEN bitcoin_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as btc_available,
      SUM(CASE WHEN bitcoin_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as btc_in_use,
      SUM(CASE WHEN ethereum_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as eth_available,
      SUM(CASE WHEN ethereum_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as eth_in_use,
      SUM(CASE WHEN binance_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as bsc_available,
      SUM(CASE WHEN binance_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as bsc_in_use,
      SUM(CASE WHEN tron_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as tron_available,
      SUM(CASE WHEN tron_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as tron_in_use,
      SUM(CASE WHEN erc20_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as erc20_available,
      SUM(CASE WHEN erc20_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as erc20_in_use,
      SUM(CASE WHEN bep20_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as bep20_available,
      SUM(CASE WHEN bep20_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as bep20_in_use,
      SUM(CASE WHEN trc20_flag IN ('true', '1', 1, true) THEN 1 ELSE 0 END) as trc20_available,
      SUM(CASE WHEN trc20_flag IN ('false', '0', 0, false) THEN 1 ELSE 0 END) as trc20_in_use
    FROM wallets
  `) as [any[], any];

  const data = rows[0];

  return {
    bitcoin: { available: Number(data.btc_available), inUse: Number(data.btc_in_use) },
    ethereum: { available: Number(data.eth_available), inUse: Number(data.eth_in_use) },
    bsc: { available: Number(data.bsc_available), inUse: Number(data.bsc_in_use) },
    tron: { available: Number(data.tron_available), inUse: Number(data.tron_in_use) },
    erc20: { available: Number(data.erc20_available), inUse: Number(data.erc20_in_use) },
    bep20: { available: Number(data.bep20_available), inUse: Number(data.bep20_in_use) },
    trc20: { available: Number(data.trc20_available), inUse: Number(data.trc20_in_use) },
  };
}

/**
 * Release all expired wallet assignments.
 *
 * This is a cleanup function that should be called periodically (via cron)
 * to handle cases where wallets weren't properly released.
 *
 * @returns Number of wallets released
 */
export async function releaseExpiredWallets(): Promise<number> {
  const pool = (await import('@/lib/mysql')).default;
  const expiryMs = DEFAULT_CONFIG.sessionTtlMinutes * 60 * 1000;
  const cutoffTime = new Date(Date.now() - expiryMs);

  // Release wallets where last_assigned is older than the cutoff
  // and the flag is still false (in use)
  const networks = [
    { flag: 'bitcoin_flag', lastAssigned: 'bitcoin_last_assigned' },
    { flag: 'ethereum_flag', lastAssigned: 'ethereum_last_assigned' },
    { flag: 'binance_flag', lastAssigned: 'binance_last_assigned' },
    { flag: 'tron_flag', lastAssigned: 'tron_last_assigned' },
    { flag: 'erc20_flag', lastAssigned: 'erc20_last_assigned' },
    { flag: 'bep20_flag', lastAssigned: 'bep20_last_assigned' },
    { flag: 'trc20_flag', lastAssigned: 'trc20_last_assigned' },
  ];

  let totalReleased = 0;

  for (const { flag, lastAssigned } of networks) {
    const [result] = await pool.query(
      `UPDATE wallets
       SET ${flag} = 1
       WHERE ${flag} IN ('false', '0', 0, false)
         AND ${lastAssigned} IS NOT NULL
         AND ${lastAssigned} < ?`,
      [cutoffTime]
    ) as [any, any];

    totalReleased += result.affectedRows || 0;
  }

  return totalReleased;
}
