import type { NextApiRequest, NextApiResponse } from "next";
import { formatPhoneNumber } from "@/utils/utilities";
import { engineGet } from "@/lib/settle-client";

interface HistoryData {
  transactions: Record<string, unknown>[];
  total: number;
  limit: number;
  offset: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phoneNumber, walletAddress, page = "1", limit = "10" } = req.query;

  if (!phoneNumber && !walletAddress) {
    return res.status(400).json({
      error: "At least one of phone number or wallet address is required",
    });
  }

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const params: Record<string, string> = {
      limit: String(limitNumber),
      offset: String(offset),
    };

    if (phoneNumber) {
      params.phone = formatPhoneNumber(phoneNumber as string);
    } else {
      params.chat_id = walletAddress as string;
    }

    const data = await engineGet<HistoryData>("/history", params);

    if (data.transactions.length > 0) {
      return res.status(200).json({
        exists: true,
        transactions: data.transactions,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(data.total / limitNumber),
          totalItems: data.total,
        },
      });
    } else {
      return res.status(404).json({
        exists: false,
        transactions: [],
        pagination: {
          currentPage: pageNumber,
          totalPages: 0,
          totalItems: 0,
        },
      });
    }
  } catch (error: any) {
    console.error("Error checking user transactions:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json({
      error: "Internal server error",
    });
  }
}
