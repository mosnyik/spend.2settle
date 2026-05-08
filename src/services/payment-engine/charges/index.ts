/**
 * Charges Module
 *
 * Fee calculation for payments.
 */

export {
  // Types
  type FeeTier,
  type ChargeResult,

  // Constants
  AMOUNT_LIMITS,
  DEFAULT_FEE_TIERS,

  // Functions
  validateAmount,
  getFeeTier,
  getFiatCharge,
  fiatChargeToCrypto,
  calculateCharges,
  formatCryptoAmount,
  formatFiatAmount,
} from './charge-calculator';
