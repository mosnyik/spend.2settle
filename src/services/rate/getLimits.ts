export interface RateLimits {
  min: number;
  max: number;
  unit: string;
  cryptoPrice: number;
  rate: number;
}

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
