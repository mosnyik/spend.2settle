/**
 * Rate Module
 *
 * Handles exchange rate fetching, caching, and locking.
 */

export {
  getExchangeRate,
  getAssetPrice,
  lockRate,
  isRateLockValid,
  fiatToCrypto,
  cryptoToFiat,
  clearRateCache,
} from './rate-service';
