/**
 * Session Repository
 *
 * Handles database operations for payment sessions.
 *
 * This is a "repository" pattern:
 * - Pure data access (no business logic)
 * - All SQL queries live here
 * - Makes testing easier (can mock the repository)
 * - Makes switching databases easier (only change this file)
 *
 * The repository doesn't know about rates, wallets, or charges.
 * It just saves and retrieves PaymentSession objects.
 */

import {
  PaymentSession,
  PaymentStatus,
  PaymentType,
  CryptoCurrency,
  Network,
  FiatCurrency,
  CreatePaymentInput,
} from '../types';
import { SessionNotFoundError, DatabaseError } from '../errors';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Data needed to create a new session in the database.
 *
 * This is everything that goes into a PaymentSession,
 * passed in during creation.
 */
export interface CreateSessionData {
  // Identity
  id: string;
  reference: string;
  type: PaymentType;

  // Amounts
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  cryptoAmount: number;
  crypto: CryptoCurrency;
  network: Network;

  // Rate
  rate: number;
  assetPrice: number;
  rateLockedAt: Date;

  // Charges
  chargeAmount: number;
  chargeCrypto: number;

  // Wallet
  depositAddress: string;
  walletId: number;

  // Payer
  payerChatId: string;
  payerId?: number;

  // Receiver (for transfers)
  receiverId?: number;

  // Merchant (for B2B)
  merchantId?: string;

  // Timing
  expiresAt: Date;

  // Metadata
  metadata?: Record<string, unknown>;
}

/**
 * Fields that can be updated on an existing session.
 */
export interface UpdateSessionData {
  status?: PaymentStatus;
  txHash?: string;
  confirmations?: number;
  receivedAmount?: number;
  confirmedAt?: Date;
  settledAt?: Date;
  payerId?: number;
  receiverId?: number;
  cashbackAmount?: number;
  cashbackCredited?: boolean;
}

// =============================================================================
// DATABASE ROW MAPPING
// =============================================================================

/**
 * Map a database row to a PaymentSession object.
 *
 * The database stores data in snake_case columns.
 * We convert to camelCase for JavaScript.
 */
function rowToSession(row: any): PaymentSession {
  return {
    // Identity
    id: row.id,
    reference: row.reference,
    type: row.type as PaymentType,
    status: row.status as PaymentStatus,

    // Amounts
    fiatAmount: Number(row.fiat_amount),
    fiatCurrency: row.fiat_currency as FiatCurrency,
    cryptoAmount: Number(row.crypto_amount),
    crypto: row.crypto_currency as CryptoCurrency,
    network: row.network as Network,

    // Rate
    rate: Number(row.rate),
    assetPrice: Number(row.asset_price),
    rateLockedAt: new Date(row.rate_locked_at),

    // Charges
    chargeAmount: Number(row.charge_amount),
    chargeCrypto: Number(row.charge_crypto),

    // Wallet
    depositAddress: row.deposit_address,
    walletId: Number(row.wallet_id),

    // Payer
    payerId: row.payer_id ? Number(row.payer_id) : undefined,
    payerChatId: row.payer_chat_id,

    // Receiver
    receiverId: row.receiver_id ? Number(row.receiver_id) : undefined,

    // Merchant
    merchantId: row.merchant_id || undefined,

    // On-chain
    txHash: row.tx_hash || undefined,
    confirmations: row.confirmations ? Number(row.confirmations) : undefined,
    receivedAmount: row.received_amount ? Number(row.received_amount) : undefined,

    // Timing
    createdAt: new Date(row.created_at),
    expiresAt: new Date(row.expires_at),
    confirmedAt: row.confirmed_at ? new Date(row.confirmed_at) : undefined,
    settledAt: row.settled_at ? new Date(row.settled_at) : undefined,

    // Metadata
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,

    // Cashback
    cashbackAmount: row.cashback_amount ? Number(row.cashback_amount) : undefined,
    cashbackCredited: row.cashback_credited ? Boolean(row.cashback_credited) : undefined,
  };
}

// =============================================================================
// REPOSITORY CLASS
// =============================================================================

/**
 * Repository for payment session database operations.
 *
 * Usage:
 * ```typescript
 * const repo = new SessionRepository();
 * const session = await repo.create(sessionData);
 * const found = await repo.findById(session.id);
 * await repo.updateStatus(session.id, 'confirmed');
 * ```
 */
export class SessionRepository {
  /**
   * Create a new payment session in the database.
   *
   * @param data - All the data for the new session
   * @returns The created session
   */
  async create(data: CreateSessionData): Promise<PaymentSession> {
    const pool = (await import('@/lib/mysql')).default;

    const now = new Date();

    try {
      await pool.query(
        `INSERT INTO payment_sessions (
          id, reference, type, status,
          fiat_amount, fiat_currency, crypto_amount, crypto_currency, network,
          rate, asset_price, rate_locked_at,
          charge_amount, charge_crypto,
          deposit_address, wallet_id,
          payer_chat_id, payer_id, receiver_id, merchant_id,
          expires_at, created_at, updated_at,
          metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          data.reference,
          data.type,
          'pending', // Initial status after wallet assigned
          data.fiatAmount,
          data.fiatCurrency,
          data.cryptoAmount,
          data.crypto,
          data.network,
          data.rate,
          data.assetPrice,
          data.rateLockedAt,
          data.chargeAmount,
          data.chargeCrypto,
          data.depositAddress,
          data.walletId,
          data.payerChatId,
          data.payerId || null,
          data.receiverId || null,
          data.merchantId || null,
          data.expiresAt,
          now,
          now,
          data.metadata ? JSON.stringify(data.metadata) : null,
        ]
      );

      // Return the full session object
      return {
        ...data,
        status: 'pending',
        createdAt: now,
      } as PaymentSession;
    } catch (error) {
      throw new DatabaseError('create session', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Find a session by its ID.
   *
   * @param id - The session ID (e.g., 'pay_abc123...')
   * @returns The session, or null if not found
   */
  async findById(id: string): Promise<PaymentSession | null> {
    const pool = (await import('@/lib/mysql')).default;

    try {
      const [rows] = await pool.query<any[]>(
        'SELECT * FROM payment_sessions WHERE id = ?',
        [id]
      );

      if (!rows || rows.length === 0) {
        return null;
      }

      return rowToSession(rows[0]);
    } catch (error) {
      throw new DatabaseError('find session by id', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Find a session by its reference.
   *
   * @param reference - The human-readable reference (e.g., '2S-A1B2C3')
   * @returns The session, or null if not found
   */
  async findByReference(reference: string): Promise<PaymentSession | null> {
    const pool = (await import('@/lib/mysql')).default;

    try {
      const [rows] = await pool.query<any[]>(
        'SELECT * FROM payment_sessions WHERE reference = ?',
        [reference]
      );

      if (!rows || rows.length === 0) {
        return null;
      }

      return rowToSession(rows[0]);
    } catch (error) {
      throw new DatabaseError('find session by reference', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Find sessions by status.
   *
   * Useful for batch operations like expiring pending sessions
   * or processing confirmed sessions.
   *
   * @param status - The status to filter by
   * @param limit - Maximum number of sessions to return
   * @returns Array of matching sessions
   */
  async findByStatus(status: PaymentStatus, limit: number = 100): Promise<PaymentSession[]> {
    const pool = (await import('@/lib/mysql')).default;

    try {
      const [rows] = await pool.query<any[]>(
        'SELECT * FROM payment_sessions WHERE status = ? ORDER BY created_at ASC LIMIT ?',
        [status, limit]
      );

      return (rows || []).map(rowToSession);
    } catch (error) {
      throw new DatabaseError('find sessions by status', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Find expired sessions that are still pending.
   *
   * These sessions should be marked as expired.
   *
   * @param limit - Maximum number to return
   * @returns Array of expired pending sessions
   */
  async findExpiredPending(limit: number = 100): Promise<PaymentSession[]> {
    const pool = (await import('@/lib/mysql')).default;
    const now = new Date();

    try {
      const [rows] = await pool.query<any[]>(
        `SELECT * FROM payment_sessions
         WHERE status = 'pending'
           AND expires_at < ?
         ORDER BY expires_at ASC
         LIMIT ?`,
        [now, limit]
      );

      return (rows || []).map(rowToSession);
    } catch (error) {
      throw new DatabaseError('find expired pending sessions', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Update a session's data.
   *
   * Only updates the fields that are provided.
   *
   * @param id - The session ID
   * @param data - Fields to update
   * @returns The updated session
   */
  async update(id: string, data: UpdateSessionData): Promise<PaymentSession> {
    const pool = (await import('@/lib/mysql')).default;

    // Build dynamic UPDATE query based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.txHash !== undefined) {
      updates.push('tx_hash = ?');
      values.push(data.txHash);
    }
    if (data.confirmations !== undefined) {
      updates.push('confirmations = ?');
      values.push(data.confirmations);
    }
    if (data.receivedAmount !== undefined) {
      updates.push('received_amount = ?');
      values.push(data.receivedAmount);
    }
    if (data.confirmedAt !== undefined) {
      updates.push('confirmed_at = ?');
      values.push(data.confirmedAt);
    }
    if (data.settledAt !== undefined) {
      updates.push('settled_at = ?');
      values.push(data.settledAt);
    }
    if (data.payerId !== undefined) {
      updates.push('payer_id = ?');
      values.push(data.payerId);
    }
    if (data.receiverId !== undefined) {
      updates.push('receiver_id = ?');
      values.push(data.receiverId);
    }
    if (data.cashbackAmount !== undefined) {
      updates.push('cashback_amount = ?');
      values.push(data.cashbackAmount);
    }
    if (data.cashbackCredited !== undefined) {
      updates.push('cashback_credited = ?');
      values.push(data.cashbackCredited ? 1 : 0);
    }

    // Always update updated_at
    updates.push('updated_at = ?');
    values.push(new Date());

    // Add the ID for the WHERE clause
    values.push(id);

    if (updates.length === 1) {
      // Only updated_at, nothing else to change
      // Still fetch and return the session
      const session = await this.findById(id);
      if (!session) {
        throw new SessionNotFoundError(id);
      }
      return session;
    }

    try {
      await pool.query(
        `UPDATE payment_sessions SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const session = await this.findById(id);
      if (!session) {
        throw new SessionNotFoundError(id);
      }

      return session;
    } catch (error) {
      if (error instanceof SessionNotFoundError) {
        throw error;
      }
      throw new DatabaseError('update session', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Check if a reference already exists.
   *
   * Used when generating references to ensure uniqueness.
   *
   * @param reference - The reference to check
   * @returns True if the reference exists
   */
  async referenceExists(reference: string): Promise<boolean> {
    const pool = (await import('@/lib/mysql')).default;

    try {
      const [rows] = await pool.query<any[]>(
        'SELECT 1 FROM payment_sessions WHERE reference = ? LIMIT 1',
        [reference]
      );

      return rows && rows.length > 0;
    } catch (error) {
      throw new DatabaseError('check reference exists', error instanceof Error ? error : undefined);
    }
  }
}

// Export a singleton instance for convenience
export const sessionRepository = new SessionRepository();
