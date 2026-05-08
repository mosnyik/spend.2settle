import type { NextApiRequest, NextApiResponse } from "next";
import { engineGet } from "@/lib/settle-client";

interface HistoryResponse {
  status: boolean;
  data: {
    transactions: Record<string, unknown>[];
    total: number;
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

  const { status = "Successful", type } = req.query;

  try {
    const params: Record<string, string> = {
      status: status as string,
      limit: "20",
    };
    if (type) params.type = type as string;

    const result = await engineGet<HistoryResponse>("/history", params);

    return res.status(200).json({ transactions: result.data.transactions });
  } catch (error: any) {
    console.error("Error fetching transactions:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json({
      message: "There was an internal error when trying to fetch transactions",
    });
  }
}
