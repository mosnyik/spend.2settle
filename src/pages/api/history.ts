import type { NextApiRequest, NextApiResponse } from "next";
import { engineGet } from "@/lib/settle-client";

interface HistoryResponse {
  status: boolean;
  data: {
    transactions: Record<string, unknown>[];
    total: number;
    limit: number;
    offset: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { phone, chat_id, status, type, from, to, limit, offset } = req.query;

  try {
    const params: Record<string, string> = {};
    if (phone)   params.phone   = phone as string;
    if (chat_id) params.chat_id = chat_id as string;
    if (status)  params.status  = status as string;
    if (type)    params.type    = type as string;
    if (from)    params.from    = from as string;
    if (to)      params.to      = to as string;
    if (limit)   params.limit   = limit as string;
    if (offset)  params.offset  = offset as string;

    const result = await engineGet<HistoryResponse>("/history", params);

    return res.status(200).json(result.data);
  } catch (error: any) {
    console.error("Error fetching transaction history:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json({
      error: "Failed to fetch transaction history",
    });
  }
}
