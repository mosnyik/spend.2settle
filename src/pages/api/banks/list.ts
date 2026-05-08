import type { NextApiRequest, NextApiResponse } from "next";
import { engineGet } from "@/lib/settle-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.query;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "name query param is required" });
  }

  try {
    const data = await engineGet<{ message: string[] }>("/banks/list", { name });
    return res.status(200).json(data);
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message = err?.response?.data?.message ?? "Failed to fetch banks";
    return res.status(status).json({ message });
  }
}
