export interface RateLimits {
  min: number;
  max: number;
  unit: string;
  cryptoPrice: number;
  rate: number;
}

export const REQUEST_LIMITS_CRYPTO = "USDT";
export const REQUEST_LIMITS_ESTIMATE_ASSET = "Naira";

/**
 * Fetch min/max transaction limits from the payment engine via the local proxy.
 *
 * @param crypto      - asset symbol, e.g. "BTC", "ETH", "USDT"
 * @param estimateAsset - "naira" | "dollar" | or the crypto symbol itself
 */
export async function getLimits(
  crypto: string,
  estimateAsset: string,
): Promise<RateLimits> {
  const params = new URLSearchParams({ crypto, estimateAsset });
  const res = await fetch(`/api/rate/limits?${params.toString()}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Failed to fetch limits (${res.status})`);
  }

  return res.json() as Promise<RateLimits>;
}

export async function getRequestLimits(): Promise<RateLimits> {
  return getLimits(REQUEST_LIMITS_CRYPTO, REQUEST_LIMITS_ESTIMATE_ASSET);
}
