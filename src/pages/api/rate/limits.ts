import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { AMOUNT_LIMITS } from "@/services/payment-engine/charges";

const ENGINE_BASE = process.env.NEXT_PUBLIC_SETTLE_API_URL ?? "http://localhost:3500/v1";

function parseRate(value: string | number): number {
  const rate = typeof value === "number" ? value : Number(value.replace(/,/g, ""));

  if (Number.isNaN(rate) || rate <= 0) {
    throw new Error("Invalid rate received");
  }

  return rate;
}

async function fetchRate(): Promise<number> {
  const response = await axios.get<{
    rate?: string | number;
    rateNumeric?: string | number;
  }>(`${ENGINE_BASE}/rate/all`);

  return parseRate(response.data.rateNumeric ?? response.data.rate ?? 0);
}

async function fetchCryptoPrice(crypto: string): Promise<number> {
  const symbol = crypto.toUpperCase();

  if (symbol === "USDT") {
    return 1;
  }

  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
    {
      params: { symbol },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
      },
    },
  );

  const price = Number(response.data.data[symbol].quote.USD.price);

  if (Number.isNaN(price) || price <= 0) {
    throw new Error("Invalid crypto price received");
  }

  return price;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { crypto, estimateAsset } = req.query;

  if (!crypto) {
    return res.status(400).json({ error: "crypto query param is required" });
  }

  try {
    const asset = (estimateAsset as string | undefined)?.toLowerCase() ?? "naira";
    const [rate, cryptoPrice] = await Promise.all([
      fetchRate(),
      fetchCryptoPrice(crypto as string),
    ]);

    if (asset === "dollar") {
      return res.status(200).json({
        min: AMOUNT_LIMITS.MIN / rate,
        max: AMOUNT_LIMITS.MAX / rate,
        unit: "USD",
        cryptoPrice,
        rate,
      });
    }

    if (asset !== "naira") {
      return res.status(200).json({
        min: AMOUNT_LIMITS.MIN / rate / cryptoPrice,
        max: AMOUNT_LIMITS.MAX / rate / cryptoPrice,
        unit: (crypto as string).toUpperCase(),
        cryptoPrice,
        rate,
      });
    }

    return res.status(200).json({
      min: AMOUNT_LIMITS.MIN,
      max: AMOUNT_LIMITS.MAX,
      unit: "NGN",
      cryptoPrice,
      rate,
    });
  } catch (err) {
    console.error("Error calculating /rate/limits:", err);
    return res.status(500).json({ error: "Failed to fetch rate limits" });
  }
}
