import type { NextApiRequest, NextApiResponse } from "next";
import { engineGet } from "@/lib/settle-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { request_id } = req.query;

  if (!request_id) {
    return res.status(400).json({ message: "request_id is required" });
  }

  try {
    const result = await engineGet(`/payments/${request_id}`);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Check request error:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json(
      error?.response?.data ?? { error: "Failed to check request" }
    );
  }
}
