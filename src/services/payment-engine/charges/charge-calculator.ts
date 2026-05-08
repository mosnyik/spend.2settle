/**
 * Charge Calculator
 *
 * Calculates transaction fees for payments.
 *
 * Fee Structure (Tiered):
 * -----------------------
 * | Fiat Amount              | Charge (NGN) |
 * |--------------------------|--------------|
 * | ₦0 - ₦100,000           | ₦500         |
 * | ₦100,001 - ₦1,000,000   | ₦1,000       |
 * | ₦1,000,001 - ₦2,000,000 | ₦1,500       |
 *
 * Limits:
 * -------
 * - Minimum: ₦0
 * - Maximum: ₦2,000,000
 *
 * The charge is always calculated in fiat (NGN), then converted to crypto
 * using the locked rates.
 *
 * Why tiered?
 * -----------
 * - Flat fees are simple to understand
 * - Percentage fees would be expensive for large transactions
 * - Tiered structure balances fairness and revenue
 *
 * Future: Support custom fee structures per merchant/client
 */

import { CryptoCurrency, RateLock } from '../types';
import { InvalidInputError } from '../errors';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Fee tier thresholds and amounts.
 *
 * This structure allows easy modification of fee tiers.
 * Each tier has a max amount (upper bound) and fee amount.
 */
export interface FeeTier {
  /** Maximum fiat amount for this tier (inclusive) */
  maxAmount: number;

  /** Fee amount in fiat (NGN) */
  feeAmount: number;

  /** Human-readable name for this tier */
  name: string;
}

/**
 * Result of charge calculation.
 */
export interface ChargeResult {
  /** Fee amount in fiat currency (NGN) */
  fiatCharge: number;

  /** Fee amount in crypto */
  cryptoCharge: number;

  /** Which tier was applied */
  tierName: string;

  /** The fiat amount before adding charges */
  netFiatAmount: number;

  /** The crypto amount the user needs to send (including fee) */
  totalCryptoAmount: number;
}

// =============================================================================
// LIMITS & FEE TIERS
// =============================================================================

/**
 * Transaction amount limits.
 */
export const AMOUNT_LIMITS = {
  /** Minimum transaction amount (₦0) */
  MIN: 0,
  /** Maximum transaction amount (₦2,000,000) */
  MAX: 2_000_000,
} as const;

/**
 * Default fee tiers.
 *
 * The tiers are checked in order. The first tier where
 * amount <= maxAmount is used.
 */
export const DEFAULT_FEE_TIERS: FeeTier[] = [
  {
    maxAmount: 100_000,        // ₦0 - ₦100,000
    feeAmount: 500,            // ₦500 fee
    name: 'basic',
  },
  {
    maxAmount: 1_000_000,      // ₦100,001 - ₦1,000,000
    feeAmount: 1_000,          // ₦1,000 fee
    name: 'standard',
  },
  {
    maxAmount: 2_000_000,      // ₦1,000,001 - ₦2,000,000
    feeAmount: 1_500,          // ₦1,500 fee
    name: 'premium',
  },
];

// =============================================================================
// CORE LOGIC
// =============================================================================

/**
 * Validate that the fiat amount is within allowed limits.
 *
 * @param fiatAmount - The transaction amount in fiat
 * @throws InvalidInputError if amount is outside limits
 */
export function validateAmount(fiatAmount: number): void {
  if (fiatAmount < AMOUNT_LIMITS.MIN) {
    throw new InvalidInputError(
      `Amount cannot be negative. Minimum is ₦${AMOUNT_LIMITS.MIN.toLocaleString()}.`,
      'fiatAmount',
      fiatAmount
    );
  }

  if (fiatAmount > AMOUNT_LIMITS.MAX) {
    throw new InvalidInputError(
      `Amount exceeds maximum limit. Maximum is ₦${AMOUNT_LIMITS.MAX.toLocaleString()}.`,
      'fiatAmount',
      fiatAmount
    );
  }
}

/**
 * Determine which fee tier applies for a given amount.
 *
 * @param fiatAmount - The transaction amount in fiat
 * @param tiers - Fee tier configuration (defaults to DEFAULT_FEE_TIERS)
 * @returns The applicable fee tier
 * @throws InvalidInputError if amount exceeds maximum limit
 */
export function getFeeTier(
  fiatAmount: number,
  tiers: FeeTier[] = DEFAULT_FEE_TIERS
): FeeTier {
  // Validate amount is within limits
  validateAmount(fiatAmount);

  // Find the first tier where amount <= maxAmount
  for (const tier of tiers) {
    if (fiatAmount <= tier.maxAmount) {
      return tier;
    }
  }

  // Fallback to last tier (shouldn't happen if tiers are configured correctly)
  return tiers[tiers.length - 1];
}

/**
 * Get the fee amount in fiat for a given transaction amount.
 *
 * @param fiatAmount - The transaction amount in fiat
 * @param tiers - Fee tier configuration
 * @returns Fee amount in fiat (NGN)
 */
export function getFiatCharge(
  fiatAmount: number,
  tiers: FeeTier[] = DEFAULT_FEE_TIERS
): number {
  const tier = getFeeTier(fiatAmount, tiers);
  return tier.feeAmount;
}

/**
 * Convert a fiat charge to crypto.
 *
 * The conversion depends on the crypto type:
 * - USDT: fiatCharge / rate (USDT ≈ $1, so just divide by rate)
 * - Others: fiatCharge / rate / assetPrice (convert fiat → USD → crypto)
 *
 * @param fiatCharge - Fee amount in fiat (NGN)
 * @param crypto - The cryptocurrency
 * @param rateLock - Locked exchange rates
 * @returns Fee amount in crypto
 */
export function fiatChargeToCrypto(
  fiatCharge: number,
  crypto: CryptoCurrency,
  rateLock: RateLock
): number {
  // USDT is pegged to $1, so assetPrice is always 1
  // Formula: fiatCharge / rate = USD amount = USDT amount
  if (crypto === 'USDT') {
    return fiatCharge / rateLock.rate;
  }

  // For other cryptos:
  // Step 1: fiatCharge / rate = USD amount
  // Step 2: USD amount / assetPrice = crypto amount
  return fiatCharge / rateLock.rate / rateLock.assetPrice;
}

/**
 * Calculate all charges for a payment.
 *
 * This is the main function you'll use. It:
 * 1. Determines the fee tier based on fiat amount
 * 2. Calculates the fiat fee
 * 3. Converts the fee to crypto
 * 4. Calculates the total crypto amount (net + fee)
 *
 * @param fiatAmount - The amount the recipient will receive (in fiat)
 * @param crypto - The cryptocurrency being used
 * @param rateLock - Locked exchange rates
 * @param tiers - Fee tier configuration (optional)
 * @returns Complete charge calculation result
 *
 * @example
 * ```typescript
 * const lock = await lockRate('BTC', 'NGN');
 *
 * const charges = calculateCharges(50000, 'BTC', lock);
 * // charges = {
 * //   fiatCharge: 500,           // ₦500 fee (basic tier)
 * //   cryptoCharge: 0.00000329,  // Fee in BTC
 * //   tierName: 'basic',
 * //   netFiatAmount: 50000,      // What recipient gets
 * //   totalCryptoAmount: 0.00033 // What user sends (net + fee)
 * // }
 * ```
 */
export function calculateCharges(
  fiatAmount: number,
  crypto: CryptoCurrency,
  rateLock: RateLock,
  tiers: FeeTier[] = DEFAULT_FEE_TIERS
): ChargeResult {
  // 1. Get the fee tier
  const tier = getFeeTier(fiatAmount, tiers);

  // 2. Get fiat charge
  const fiatCharge = tier.feeAmount;

  // 3. Convert to crypto
  const cryptoCharge = fiatChargeToCrypto(fiatCharge, crypto, rateLock);

  // 4. Calculate net crypto (what the recipient amount converts to)
  //    For USDT: fiatAmount / rate
  //    For others: fiatAmount / rate / assetPrice
  let netCrypto: number;
  if (crypto === 'USDT') {
    netCrypto = fiatAmount / rateLock.rate;
  } else {
    netCrypto = fiatAmount / rateLock.rate / rateLock.assetPrice;
  }

  // 5. Total crypto = net + fee
  const totalCryptoAmount = netCrypto + cryptoCharge;

  return {
    fiatCharge,
    cryptoCharge,
    tierName: tier.name,
    netFiatAmount: fiatAmount,
    totalCryptoAmount,
  };
}

/**
 * Format a crypto amount for display.
 *
 * Crypto amounts need many decimal places for accuracy:
 * - BTC: 8 decimals (satoshi precision)
 * - ETH: 8 decimals (wei has 18, but 8 is practical)
 * - USDT: 2-6 decimals (depends on context)
 *
 * @param amount - The crypto amount
 * @param crypto - The cryptocurrency (for choosing decimals)
 * @returns Formatted string
 */
export function formatCryptoAmount(
  amount: number,
  crypto: CryptoCurrency
): string {
  // USDT shows fewer decimals since it's dollar-denominated
  const decimals = crypto === 'USDT' ? 4 : 8;

  return amount.toFixed(decimals);
}

/**
 * Format a fiat amount for display.
 *
 * @param amount - The fiat amount
 * @param currency - The currency code (default: NGN)
 * @returns Formatted string with currency symbol
 */
export function formatFiatAmount(
  amount: number,
  currency: string = 'NGN'
): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
