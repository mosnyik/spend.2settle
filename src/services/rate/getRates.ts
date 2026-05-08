/**
 * Single source of truth for reading rates in imperative (non-React) code.
 *
 * Reads from paymentStore when fresh. If stale or missing, fetches once —
 * concurrent callers share the same in-flight promise so only one request
 * goes out even if RateBootstrapper and a chat handler fire at the same time.
 */
import { usePaymentStore } from "stores/paymentStore";
import { fetchMerchantRate, fetchProfitRate, fetchRate } from "./rates.service";

const RATE_TTL  = 3  * 60 * 1000; // 3 min  — matches RateBootstrapper
const RATES_TTL = 15 * 60 * 1000; // 15 min — matches RateBootstrapper

// In-flight promise singletons — prevent duplicate concurrent fetches
let _rateFetch:         Promise<number> | null = null;
let _merchantRateFetch: Promise<number> | null = null;
let _profitRateFetch:   Promise<number> | null = null;

export async function getRate(): Promise<number> {
  const { rate, lastRateFetchedAt, setRate } = usePaymentStore.getState();

  if (rate && Date.now() - lastRateFetchedAt < RATE_TTL) {
    return parseFloat(rate);
  }

  if (!_rateFetch) {
    _rateFetch = fetchRate()
      .then((fresh) => { setRate(fresh.toString()); return fresh; })
      .finally(() => { _rateFetch = null; });
  }

  return _rateFetch;
}

export async function getMerchantRate(): Promise<number> {
  const { merchantRate, lastMerchantRateFetchedAt, setMerchantRate } =
    usePaymentStore.getState();

  if (merchantRate && Date.now() - lastMerchantRateFetchedAt < RATES_TTL) {
    return parseFloat(merchantRate);
  }

  if (!_merchantRateFetch) {
    _merchantRateFetch = fetchMerchantRate()
      .then((fresh) => { setMerchantRate(fresh.toString()); return fresh; })
      .finally(() => { _merchantRateFetch = null; });
  }

  return _merchantRateFetch;
}

export async function getProfitRate(): Promise<number> {
  const { profitRate, lastProfitRateFetchedAt, setProfitRate } =
    usePaymentStore.getState();

  if (profitRate && Date.now() - lastProfitRateFetchedAt < RATES_TTL) {
    return parseFloat(profitRate);
  }

  if (!_profitRateFetch) {
    _profitRateFetch = fetchProfitRate()
      .then((fresh) => { setProfitRate(fresh.toString()); return fresh; })
      .finally(() => { _profitRateFetch = null; });
  }

  return _profitRateFetch;
}
