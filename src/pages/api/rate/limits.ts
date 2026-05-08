import type { NextApiRequest, NextApiResponse } from "next";

const ENGINE_BASE = process.env.NEXT_PUBLIC_SETTLE_API_URL ?? "http://localhost:3500/v1";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { crypto, estimateAsset } = req.query;

  if (!crypto) {
    return res.status(400).json({ error: "crypto query param is required" });
  }

  const params = new URLSearchParams();
  params.set("crypto", crypto as string);
  if (estimateAsset) params.set("estimateAsset", estimateAsset as string);

  try {
    const response = await fetch(`${ENGINE_BASE}/rate/limits?${params.toString()}`);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Error proxying /rate/limits:", err);
    return res.status(500).json({ error: "Failed to fetch rate limits" });
  }
}
