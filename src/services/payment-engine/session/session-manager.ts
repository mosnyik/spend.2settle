/**
 * Session Manager
 *
 * The main orchestrator for payment sessions.
 *
 * This is where everything comes together:
 * - Lock exchange rates
 * - Calculate charges
 * - Assign wallets
 * - Create sessions in database
 * - Handle state transitions
 *
 * Think of it as the "conductor" of an orchestra:
 * - Rate service is the violins
 * - Charge calculator is the cellos
 * - Wallet pool is the brass
 * - Session repository is the percussion
 * - Session manager makes them all play together
 *
 * Usage:
 * ```typescript
 * const manager = new SessionManager();
 *
 * // Create a new payment
 * const session = await manager.createSession({
 *   type: 'transfer',
 *   fiatAmount: 50000,
 *   fiatCurrency: 'NGN',
 *   crypto: 'USDT',
 *   network: 'bep20',
 *   payer: { chatId: 'user123' },
 *   receiver: { bankCode: '058', accountNumber: '1234567890', accountName: 'John' }
 * });
 *
 * // Later, when deposit is detected
 * await manager.confirmDeposit(session.id, '0xabc...');
 * ```
 */

import {
  CreatePaymentInput,
  PaymentSession,
  PaymentStatus,
  DEFAULT_CONFIG,
  PaymentEngineConfig,
} from '../types';
import {
  InvalidInputError,
  InvalidSessionStateError,
  SessionNotFoundError,
  RateLockExpiredError,
  UnsupportedCryptoNetworkError,
} from '../errors';
import { generatePaymentIds } from '../utils';
import { lockRate, isRateLockValid } from '../rate';
import { calculateCharges } from '../charges';
import { assignWallet, releaseWallet } from '../wallet';
import { SessionRepository, sessionRepository, CreateSessionData } from './session-repository';

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Valid crypto/network combinations.
 *
 * Not all cryptos work on all networks:
 * - BTC only works on bitcoin
 * - ETH only works on ethereum
 * - USDT works on multiple networks
 */
const VALID_CRYPTO_NETWORKS: Record<string, string[]> = {
  BTC: ['bitcoin'],
  ETH: ['ethereum'],
  BNB: ['bsc'],
  TRX: ['tron'],
  USDT: ['ethereum', 'erc20', 'bsc', 'bep20', 'tron', 'trc20'],
};

/**
 * Validate that a crypto/network combination is supported.
 */
function validateCryptoNetwork(crypto: string, network: string): void {
  const validNetworks = VALID_CRYPTO_NETWORKS[crypto];

  if (!validNetworks) {
    throw new InvalidInputError(`Unsupported cryptocurrency: ${crypto}`, 'crypto', crypto);
  }

  if (!validNetworks.includes(network)) {
    throw new UnsupportedCryptoNetworkError(crypto, network);
  }
}

/**
 * Validate the input for creating a payment.
 */
function validateCreateInput(input: CreatePaymentInput): void {
  // Required fields
  if (!input.type) {
    throw new InvalidInputError('Payment type is required', 'type');
  }

  if (!input.fiatAmount || input.fiatAmount <= 0) {
    throw new InvalidInputError('Fiat amount must be positive', 'fiatAmount', input.fiatAmount);
  }

  if (!input.fiatCurrency) {
    throw new InvalidInputError('Fiat currency is required', 'fiatCurrency');
  }

  if (!input.crypto) {
    throw new InvalidInputError('Crypto is required', 'crypto');
  }

  if (!input.network) {
    throw new InvalidInputError('Network is required', 'network');
  }

  if (!input.payer?.chatId) {
    throw new InvalidInputError('Payer chat ID is required', 'payer.chatId');
  }

  // Transfers require receiver
  if (input.type === 'transfer') {
    if (!input.receiver) {
      throw new InvalidInputError('Receiver is required for transfers', 'receiver');
    }
    if (!input.receiver.bankCode) {
      throw new InvalidInputError('Receiver bank code is required', 'receiver.bankCode');
    }
    if (!input.receiver.accountNumber) {
      throw new InvalidInputError('Receiver account number is required', 'receiver.accountNumber');
    }
    if (!input.receiver.accountName) {
      throw new InvalidInputError('Receiver account name is required', 'receiver.accountName');
    }
  }

  // Validate crypto/network combination
  validateCryptoNetwork(input.crypto, input.network);
}

/**
 * Valid state transitions.
 *
 * Maps current status to allowed next statuses.
 * Prevents invalid transitions like pending → settled (skipping confirmed).
 */
const VALID_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  created: ['pending', 'expired', 'failed'],
  pending: ['confirming', 'expired', 'failed'],
  confirming: ['confirmed', 'failed'],
  confirmed: ['settling', 'failed'],
  settling: ['settled', 'failed'],
  settled: [], // Terminal state
  expired: [], // Terminal state
  failed: [], // Terminal state
};

/**
 * Check if a status transition is valid.
 */
function isValidTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// =============================================================================
// SESSION MANAGER CLASS
// =============================================================================

/**
 * Session Manager - orchestrates payment session lifecycle.
 */
export class SessionManager {
  private repository: SessionRepository;
  private config: PaymentEngineConfig;

  constructor(
    repository: SessionRepository = sessionRepository,
    config: PaymentEngineConfig = DEFAULT_CONFIG
  ) {
    this.repository = repository;
    this.config = config;
  }

  /**
   * Create a new payment session.
   *
   * This is the main entry point for starting a payment.
   *
   * Steps:
   * 1. Validate input
   * 2. Lock exchange rate
   * 3. Calculate charges
   * 4. Assign wallet from pool
   * 5. Generate IDs
   * 6. Save to database
   * 7. Return the session
   *
   * @param input - Payment details
   * @returns The created payment session
   */
  async createSession(input: CreatePaymentInput): Promise<PaymentSession> {
    // Step 1: Validate
    validateCreateInput(input);

    // Step 2: Lock rate
    const rateLock = await lockRate(
      input.crypto,
      input.fiatCurrency,
      this.config.rateLockTtlMinutes
    );

    // Step 3: Calculate charges
    const charges = calculateCharges(
      input.fiatAmount,
      input.crypto,
      rateLock
    );

    // Step 4: Assign wallet
    const wallet = await assignWallet(
      input.network,
      this.config.sessionTtlMinutes
    );

    // Step 5: Generate IDs (with collision check for reference)
    let ids = generatePaymentIds();
    let attempts = 0;
    const maxAttempts = 5;

    while (await this.repository.referenceExists(ids.reference)) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique reference after multiple attempts');
      }
      ids = generatePaymentIds();
    }

    // Step 6: Prepare session data
    const sessionData: CreateSessionData = {
      id: ids.id,
      reference: ids.reference,
      type: input.type,

      fiatAmount: input.fiatAmount,
      fiatCurrency: input.fiatCurrency,
      cryptoAmount: charges.totalCryptoAmount,
      crypto: input.crypto,
      network: input.network,

      rate: rateLock.rate,
      assetPrice: rateLock.assetPrice,
      rateLockedAt: rateLock.lockedAt,

      chargeAmount: charges.fiatCharge,
      chargeCrypto: charges.cryptoCharge,

      depositAddress: wallet.address,
      walletId: wallet.walletId,

      payerChatId: input.payer.chatId,

      merchantId: input.merchantId,

      expiresAt: wallet.expiresAt,

      metadata: input.metadata,
    };

    // Step 7: Save to database
    const session = await this.repository.create(sessionData);

    return session;
  }

  /**
   * Get a session by ID.
   *
   * @param id - The session ID
   * @returns The session
   * @throws SessionNotFoundError if not found
   */
  async getSession(id: string): Promise<PaymentSession> {
    const session = await this.repository.findById(id);

    if (!session) {
      throw new SessionNotFoundError(id);
    }

    return session;
  }

  /**
   * Get a session by reference.
   *
   * @param reference - The human-readable reference
   * @returns The session
   * @throws SessionNotFoundError if not found
   */
  async getSessionByReference(reference: string): Promise<PaymentSession> {
    const session = await this.repository.findByReference(reference);

    if (!session) {
      throw new SessionNotFoundError(reference);
    }

    return session;
  }

  /**
   * Update session status with validation.
   *
   * Ensures only valid state transitions are allowed.
   *
   * @param id - The session ID
   * @param newStatus - The new status
   * @returns The updated session
   */
  async updateStatus(id: string, newStatus: PaymentStatus): Promise<PaymentSession> {
    const session = await this.getSession(id);

    if (!isValidTransition(session.status, newStatus)) {
      throw new InvalidSessionStateError(
        session.status,
        `transition to ${newStatus}`,
        VALID_TRANSITIONS[session.status]
      );
    }

    return this.repository.update(id, { status: newStatus });
  }

  /**
   * Mark a session as having detected a deposit (confirming).
   *
   * Called when the deposit monitor detects an incoming transaction.
   *
   * @param id - The session ID
   * @param txHash - The transaction hash
   * @param receivedAmount - The amount received (in crypto)
   */
  async markDeposit(
    id: string,
    txHash: string,
    receivedAmount: number
  ): Promise<PaymentSession> {
    const session = await this.getSession(id);

    if (session.status !== 'pending') {
      throw new InvalidSessionStateError(
        session.status,
        'mark deposit',
        ['pending']
      );
    }

    return this.repository.update(id, {
      status: 'confirming',
      txHash,
      receivedAmount,
    });
  }

  /**
   * Confirm a deposit after enough blockchain confirmations.
   *
   * @param id - The session ID
   * @param confirmations - Number of confirmations
   */
  async confirmDeposit(id: string, confirmations: number): Promise<PaymentSession> {
    const session = await this.getSession(id);

    if (session.status !== 'confirming') {
      throw new InvalidSessionStateError(
        session.status,
        'confirm deposit',
        ['confirming']
      );
    }

    // Release the wallet back to the pool
    await releaseWallet(session.walletId, session.network);

    return this.repository.update(id, {
      status: 'confirmed',
      confirmations,
      confirmedAt: new Date(),
    });
  }

  /**
   * Mark a session as settling (fiat payout in progress).
   *
   * @param id - The session ID
   */
  async markSettling(id: string): Promise<PaymentSession> {
    return this.updateStatus(id, 'settling');
  }

  /**
   * Mark a session as settled (complete).
   *
   * @param id - The session ID
   */
  async markSettled(id: string): Promise<PaymentSession> {
    const session = await this.getSession(id);

    if (session.status !== 'settling') {
      throw new InvalidSessionStateError(
        session.status,
        'mark settled',
        ['settling']
      );
    }

    return this.repository.update(id, {
      status: 'settled',
      settledAt: new Date(),
    });
  }

  /**
   * Expire a pending session.
   *
   * Called when a session times out without receiving a deposit.
   *
   * @param id - The session ID
   */
  async expireSession(id: string): Promise<PaymentSession> {
    const session = await this.getSession(id);

    if (session.status !== 'pending') {
      throw new InvalidSessionStateError(
        session.status,
        'expire',
        ['pending']
      );
    }

    // Release the wallet back to the pool
    await releaseWallet(session.walletId, session.network);

    return this.repository.update(id, { status: 'expired' });
  }

  /**
   * Mark a session as failed.
   *
   * Can be called from most states when something goes wrong.
   *
   * @param id - The session ID
   */
  async failSession(id: string): Promise<PaymentSession> {
    const session = await this.getSession(id);

    // Check if we can transition to failed
    if (!isValidTransition(session.status, 'failed')) {
      throw new InvalidSessionStateError(
        session.status,
        'fail',
        VALID_TRANSITIONS[session.status]
      );
    }

    // Release wallet if it was assigned
    if (session.status === 'pending' || session.status === 'confirming') {
      await releaseWallet(session.walletId, session.network);
    }

    return this.repository.update(id, { status: 'failed' });
  }

  /**
   * Process expired sessions in batch.
   *
   * Should be called periodically (e.g., every minute) to clean up
   * sessions that have timed out.
   *
   * @returns Number of sessions expired
   */
  async expireStale(): Promise<number> {
    const expiredSessions = await this.repository.findExpiredPending(100);

    let count = 0;
    for (const session of expiredSessions) {
      try {
        await this.expireSession(session.id);
        count++;
      } catch (error) {
        // Log but continue processing other sessions
        console.error(`Failed to expire session ${session.id}:`, error);
      }
    }

    return count;
  }

  /**
   * Update payer ID after creating/finding payer in database.
   */
  async setPayerId(sessionId: string, payerId: number): Promise<PaymentSession> {
    return this.repository.update(sessionId, { payerId });
  }

  /**
   * Update receiver ID after creating/finding receiver in database.
   */
  async setReceiverId(sessionId: string, receiverId: number): Promise<PaymentSession> {
    return this.repository.update(sessionId, { receiverId });
  }

  /**
   * Set cashback amount for a session.
   */
  async setCashback(sessionId: string, amount: number): Promise<PaymentSession> {
    return this.repository.update(sessionId, { cashbackAmount: amount });
  }

  /**
   * Mark cashback as credited.
   */
  async creditCashback(sessionId: string): Promise<PaymentSession> {
    return this.repository.update(sessionId, { cashbackCredited: true });
  }
}

// Export a singleton instance for convenience
export const sessionManager = new SessionManager();
