/**
 * Payment Engine
 *
 * A standalone payment processing engine for crypto-to-fiat transactions.
 *
 * This engine can be used by:
 * - The 2Settle chat interface
 * - The merchant API (for banks/fintechs)
 * - Any future client
 *
 * Quick Start:
 * ```typescript
 * import { PaymentEngine } from '@/services/payment-engine';
 *
 * const engine = new PaymentEngine();
 *
 * // Create a payment
 * const session = await engine.createPayment({
 *   type: 'transfer',
 *   fiatAmount: 50000,
 *   fiatCurrency: 'NGN',
 *   crypto: 'USDT',
 *   network: 'bep20',
 *   payer: { chatId: 'user123' },
 *   receiver: { bankCode: '058', accountNumber: '1234567890', accountName: 'John' }
 * });
 *
 * // User sends crypto to session.depositAddress
 * // Monitor detects deposit, calls:
 * await engine.recordDeposit(session.id, '0xabc...', 32.5);
 *
 * // After enough confirmations:
 * await engine.confirmPayment(session.id, 15);
 *
 * // After fiat payout:
 * await engine.settlePayment(session.id);
 * ```
 */

// =============================================================================
// MAIN EXPORTS
// =============================================================================

// The main class
export { PaymentEngine, paymentEngine } from './payment-engine';

// =============================================================================
// TYPES
// =============================================================================

export {
  // Enums
  type PaymentType,
  type PaymentStatus,
  type CryptoCurrency,
  type Network,
  type FiatCurrency,

  // Input types
  type PayerInput,
  type ReceiverInput,
  type CreatePaymentInput,

  // Output types
  type RateLock,
  type PaymentSession,
  type WalletAssignment,

  // Config
  type PaymentEngineConfig,
  DEFAULT_CONFIG,

  // Helpers
  NETWORK_TO_CHAIN,
  getRequiredConfirmations,
} from './types';

// =============================================================================
// ERRORS
// =============================================================================

export {
  PaymentEngineError,
  InvalidInputError,
  UnsupportedCryptoNetworkError,
  SessionNotFoundError,
  InvalidSessionStateError,
  RateLockExpiredError,
  WalletPoolEmptyError,
  RateServiceUnavailableError,
  SettlementFailedError,
  DatabaseError,
  isPaymentEngineError,
  toPaymentEngineError,
} from './errors';

// =============================================================================
// SUB-MODULES (for advanced use cases)
// =============================================================================

// Rate service
export {
  getExchangeRate,
  getAssetPrice,
  lockRate,
  isRateLockValid,
  fiatToCrypto,
  cryptoToFiat,
  clearRateCache,
} from './rate';

// Charge calculator
export {
  type FeeTier,
  type ChargeResult,
  DEFAULT_FEE_TIERS,
  getFeeTier,
  getFiatCharge,
  fiatChargeToCrypto,
  calculateCharges,
  formatCryptoAmount,
  formatFiatAmount,
} from './charges';

// Wallet pool
export {
  assignWallet,
  releaseWallet,
  releaseWalletByAddress,
  getPoolStatus,
  releaseExpiredWallets,
} from './wallet';

// Session management
export {
  SessionManager,
  sessionManager,
  SessionRepository,
  sessionRepository,
} from './session';

// Utilities
export {
  generatePaymentId,
  generatePaymentReference,
  generatePaymentIds,
  isValidPaymentId,
  isValidPaymentReference,
} from './utils';
