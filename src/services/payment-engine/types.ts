/**
 * Payment Engine Types
 *
 * This file defines all the data structures used by the payment engine.
 * Types are organized into:
 * 1. Enums - Fixed sets of values (status, transaction types)
 * 2. Input types - What you pass TO the engine
 * 3. Output types - What the engine returns
 * 4. Internal types - Used within the engine
 */

// =============================================================================
// ENUMS
// =============================================================================

/**
 * The type of payment being processed.
 *
 * - 'transfer': User sends crypto, recipient gets fiat in their bank (B2C)
 * - 'gift': User sends crypto to another user (P2P, crypto stays as crypto until claimed)
 * - 'request': User requests payment from someone else
 * - 'merchant': A business accepting crypto payment (B2B)
 */
export type PaymentType = 'transfer' | 'gift' | 'request' | 'merchant';

/**
 * The lifecycle status of a payment session.
 *
 * Flow: created → pending → confirming → confirmed → settling → settled
 *       └─────────────────→ expired (if no deposit received)
 *       └─────────────────→ failed (if something breaks)
 *
 * - 'created':    Session initialized, but wallet not yet assigned
 * - 'pending':    Wallet assigned, waiting for user to send crypto
 * - 'confirming': Deposit detected on-chain, waiting for confirmations
 * - 'confirmed':  Deposit has enough confirmations, ready for settlement
 * - 'settling':   Fiat payout to recipient is in progress
 * - 'settled':    Complete! Recipient received fiat.
 * - 'expired':    User didn't send crypto within the time window
 * - 'failed':     Something went wrong (blockchain error, settlement failed, etc.)
 */
export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'settling'
  | 'settled'
  | 'expired'
  | 'failed';

/**
 * Supported cryptocurrencies.
 * Each crypto can exist on multiple networks (e.g., USDT on Ethereum, BSC, TRON).
 */
export type CryptoCurrency = 'BTC' | 'ETH' | 'BNB' | 'TRX' | 'USDT';

/**
 * Supported blockchain networks.
 *
 * Native chains:
 * - 'bitcoin':   Bitcoin mainnet (for BTC)
 * - 'ethereum':  Ethereum mainnet (for native ETH)
 * - 'bsc':       Binance Smart Chain (for native BNB)
 * - 'tron':      TRON network (for native TRX)
 * - 'polygon':   Polygon/MATIC
 * - 'base':      Base (Coinbase L2)
 *
 * Token standards (for USDT and other tokens):
 * - 'erc20':     ERC-20 tokens on Ethereum (e.g., USDT-ERC20)
 * - 'bep20':     BEP-20 tokens on BSC (e.g., USDT-BEP20)
 * - 'trc20':     TRC-20 tokens on TRON (e.g., USDT-TRC20)
 *
 * The token standards help users understand which network they're using
 * when sending stablecoins like USDT.
 */
export type Network =
  // Native chains
  | 'bitcoin'
  | 'ethereum'
  | 'bsc'
  | 'tron'
  | 'polygon'
  | 'base'
  // Token standards (these map to their parent chains internally)
  | 'erc20'   // → ethereum
  | 'bep20'   // → bsc
  | 'trc20';  // → tron

/**
 * Maps token standards to their underlying chain.
 * Used internally to know which blockchain to monitor.
 *
 * Example: 'erc20' → 'ethereum' means we monitor Ethereum for ERC-20 deposits.
 */
export const NETWORK_TO_CHAIN: Record<Network, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  bsc: 'bsc',
  tron: 'tron',
  polygon: 'polygon',
  base: 'base',
  erc20: 'ethereum',  // ERC-20 tokens live on Ethereum
  bep20: 'bsc',       // BEP-20 tokens live on BSC
  trc20: 'tron',      // TRC-20 tokens live on TRON
};

/**
 * Supported fiat currencies for settlement.
 * Start with NGN, add more as we expand.
 */
export type FiatCurrency = 'NGN' | 'GHS' | 'KES' | 'ZAR';

// =============================================================================
// INPUT TYPES - What you pass TO the engine
// =============================================================================

/**
 * Information about who is sending the crypto (the payer).
 *
 * The payer can be identified by:
 * - chatId: Their unique chat session ID (from the 2Settle chat)
 * - phone: Their phone number (for notifications)
 * - walletAddress: The wallet they're sending FROM (for non-custodial tracking)
 */
export interface PayerInput {
  /** Unique identifier for this user in the chat system */
  chatId: string;

  /** Phone number (optional, used for SMS notifications) */
  phone?: string;

  /** The wallet address they're sending FROM (optional, for tracking) */
  walletAddress?: string;
}

/**
 * Information about who receives the fiat (for transfers).
 *
 * This is the bank account where we'll send the Naira.
 */
export interface ReceiverInput {
  /** Nigerian bank code (e.g., '058' for GTBank, '044' for Access) */
  bankCode: string;

  /** 10-digit NUBAN account number */
  accountNumber: string;

  /** Name on the bank account (verified via bank API) */
  accountName: string;

  /** Phone number of recipient (optional, for notifications) */
  phone?: string;
}

/**
 * The main input for creating a new payment.
 *
 * This is what you pass to `engine.createPayment(input)`.
 *
 * Example:
 * ```typescript
 * const input: CreatePaymentInput = {
 *   type: 'transfer',
 *   fiatAmount: 50000,           // ₦50,000
 *   fiatCurrency: 'NGN',
 *   crypto: 'USDT',
 *   network: 'bep20',            // USDT on BSC
 *   payer: {
 *     chatId: 'chat_abc123',
 *     phone: '08012345678'
 *   },
 *   receiver: {
 *     bankCode: '058',
 *     accountNumber: '1234567890',
 *     accountName: 'John Doe'
 *   }
 * };
 * ```
 */
export interface CreatePaymentInput {
  /**
   * What type of payment is this?
   * Determines the flow and what data is required.
   */
  type: PaymentType;

  /**
   * Amount in fiat currency (e.g., 50000 for ₦50,000).
   * This is what the recipient will receive (before our charges).
   */
  fiatAmount: number;

  /**
   * The fiat currency for settlement.
   * Currently only 'NGN' is supported.
   */
  fiatCurrency: FiatCurrency;

  /**
   * Which cryptocurrency the payer will send.
   */
  crypto: CryptoCurrency;

  /**
   * Which blockchain network to use.
   * Must be compatible with the chosen crypto.
   *
   * Examples:
   * - BTC → 'bitcoin'
   * - ETH → 'ethereum'
   * - BNB → 'bsc'
   * - TRX → 'tron'
   * - USDT → 'erc20', 'bep20', or 'trc20'
   */
  network: Network;

  /**
   * Who is sending the crypto.
   * Required for all payment types.
   */
  payer: PayerInput;

  /**
   * Who receives the fiat.
   * Required for 'transfer' type, optional for others.
   */
  receiver?: ReceiverInput;

  /**
   * Merchant ID (for B2B payments).
   * When set, this payment belongs to a merchant integration.
   */
  merchantId?: string;

  /**
   * Merchant's reference for this payment.
   * E.g., their order ID or invoice number.
   */
  merchantReference?: string;

  /**
   * URL to redirect after payment (for hosted checkout).
   */
  callbackUrl?: string;

  /**
   * Arbitrary metadata to attach to this payment.
   * Useful for tracking on the merchant side.
   * E.g., { orderId: '12345', customerId: 'cust_abc' }
   */
  metadata?: Record<string, unknown>;
}

// =============================================================================
// OUTPUT TYPES - What the engine returns
// =============================================================================

/**
 * A locked exchange rate.
 *
 * When a user starts a payment, we "lock" the rate so it doesn't change
 * while they're sending crypto. This protects both us and the user from
 * sudden price swings.
 */
export interface RateLock {
  /** The exchange rate (e.g., 1600 means 1 USD = ₦1600) */
  rate: number;

  /** Price of the crypto in USD (e.g., 3500 for ETH) */
  assetPrice: number;

  /** When this rate was locked */
  lockedAt: Date;

  /** When this rate expires (user must send before this) */
  expiresAt: Date;
}

/**
 * The main output - a payment session.
 *
 * This represents a single payment from creation to settlement.
 * It's returned by `engine.createPayment()` and updated throughout the lifecycle.
 */
export interface PaymentSession {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Unique identifier for this session.
   * Generated by us, used internally and in APIs.
   * Format: 'pay_' + 26 random chars (e.g., 'pay_abc123xyz789...')
   */
  id: string;

  /**
   * Human-readable reference.
   * Shown to users, used for support, easier to communicate.
   * Format: '2S-XXXXXX' (e.g., '2S-A1B2C3')
   */
  reference: string;

  /**
   * Payment type (transfer, gift, request, merchant).
   */
  type: PaymentType;

  /**
   * Current status in the lifecycle.
   */
  status: PaymentStatus;

  // ---------------------------------------------------------------------------
  // Amounts
  // ---------------------------------------------------------------------------

  /**
   * Amount in fiat that the recipient will receive.
   * This is the "headline" amount the user sees.
   */
  fiatAmount: number;

  /**
   * Fiat currency code.
   */
  fiatCurrency: FiatCurrency;

  /**
   * Amount of crypto the user needs to send.
   * Calculated from fiatAmount + charges, converted at the locked rate.
   */
  cryptoAmount: number;

  /**
   * Which crypto is being sent.
   */
  crypto: CryptoCurrency;

  /**
   * Which blockchain network.
   */
  network: Network;

  // ---------------------------------------------------------------------------
  // Rate & Charges
  // ---------------------------------------------------------------------------

  /**
   * The locked exchange rate (NGN per USD).
   */
  rate: number;

  /**
   * Price of the crypto asset in USD at lock time.
   */
  assetPrice: number;

  /**
   * When the rate was locked.
   */
  rateLockedAt: Date;

  /**
   * Our fee for this transaction (in fiat).
   * Tiered: ₦500 for <₦100k, ₦1000 for ₦100k-₦1M, ₦1500 for >₦1M
   */
  chargeAmount: number;

  /**
   * Our fee expressed in crypto (for display to user).
   */
  chargeCrypto: number;

  // ---------------------------------------------------------------------------
  // Wallet Assignment
  // ---------------------------------------------------------------------------

  /**
   * The wallet address where the user should send crypto.
   * Assigned from our pool when the session is created.
   */
  depositAddress: string;

  /**
   * Internal ID of the wallet in our pool.
   * Used to release the wallet back after completion.
   */
  walletId: number;

  // ---------------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------------

  /**
   * Internal ID of the payer (from `payers` table).
   */
  payerId?: number;

  /**
   * The payer's chat ID.
   */
  payerChatId: string;

  /**
   * Internal ID of the receiver (from `receivers` table).
   * Only set for transfers.
   */
  receiverId?: number;

  /**
   * Merchant ID (for B2B payments).
   */
  merchantId?: string;

  // ---------------------------------------------------------------------------
  // On-Chain Data (filled after deposit)
  // ---------------------------------------------------------------------------

  /**
   * Transaction hash of the deposit.
   * Set when we detect the deposit on-chain.
   */
  txHash?: string;

  /**
   * Number of blockchain confirmations.
   * We update this as the transaction confirms.
   */
  confirmations?: number;

  /**
   * Actual amount received on-chain.
   * May differ slightly from cryptoAmount due to network fees.
   */
  receivedAmount?: number;

  // ---------------------------------------------------------------------------
  // Timing
  // ---------------------------------------------------------------------------

  /**
   * When this session was created.
   */
  createdAt: Date;

  /**
   * When this session expires (if user doesn't deposit).
   * Typically 30 minutes after creation.
   */
  expiresAt: Date;

  /**
   * When the deposit was confirmed on-chain.
   */
  confirmedAt?: Date;

  /**
   * When the fiat settlement completed.
   */
  settledAt?: Date;

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  /**
   * Arbitrary metadata attached to this payment.
   */
  metadata?: Record<string, unknown>;

  // ---------------------------------------------------------------------------
  // Cashback (optional, added later)
  // ---------------------------------------------------------------------------

  /**
   * Estimated cashback for this transaction.
   * Shown to user as incentive to complete.
   */
  cashbackAmount?: number;

  /**
   * Whether cashback was credited after confirmation.
   */
  cashbackCredited?: boolean;
}

// =============================================================================
// INTERNAL TYPES - Used within the engine
// =============================================================================

/**
 * Result of assigning a wallet from the pool.
 */
export interface WalletAssignment {
  /** The wallet address to use for deposits */
  address: string;

  /** Internal ID of the wallet in our pool */
  walletId: number;

  /** When the wallet was assigned */
  assignedAt: Date;

  /** When the assignment expires (wallet released back to pool) */
  expiresAt: Date;
}

/**
 * Configuration for the payment engine.
 * These values can be overridden when instantiating the engine.
 */
export interface PaymentEngineConfig {
  /**
   * How long a payment session is valid (in minutes).
   * User must send crypto within this window.
   * Default: 30 minutes
   */
  sessionTtlMinutes: number;

  /**
   * How long a rate lock is valid (in minutes).
   * Should be <= sessionTtlMinutes.
   * Default: 30 minutes
   */
  rateLockTtlMinutes: number;

  /**
   * Tolerance for amount matching (as a decimal).
   * E.g., 0.02 means we accept deposits within 2% of expected amount.
   * This accounts for network fee variations.
   * Default: 0.02 (2%)
   */
  amountTolerance: number;

  /**
   * Required confirmations per chain before considering deposit confirmed.
   * Token standards (erc20, bep20, trc20) use their parent chain's value.
   */
  confirmations: {
    bitcoin: number;   // Default: 2
    ethereum: number;  // Default: 12 (also used for erc20)
    bsc: number;       // Default: 15 (also used for bep20)
    tron: number;      // Default: 19 (also used for trc20)
    polygon: number;   // Default: 128
    base: number;      // Default: 12
  };
}

/**
 * Default configuration values.
 * Used when no override is provided.
 */
export const DEFAULT_CONFIG: PaymentEngineConfig = {
  sessionTtlMinutes: 30,
  rateLockTtlMinutes: 30,
  amountTolerance: 0.02,
  confirmations: {
    bitcoin: 2,
    ethereum: 12,
    bsc: 15,
    tron: 19,
    polygon: 128,
    base: 12,
  },
};

/**
 * Helper function to get required confirmations for a network.
 * Handles token standards by mapping to their parent chain.
 */
export function getRequiredConfirmations(
  network: Network,
  config: PaymentEngineConfig = DEFAULT_CONFIG
): number {
  const chain = NETWORK_TO_CHAIN[network];

  // Map to the confirmations config key
  const chainKey = chain as keyof typeof config.confirmations;

  return config.confirmations[chainKey] ?? 12; // Default to 12 if unknown
}
