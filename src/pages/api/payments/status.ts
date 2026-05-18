import type { NextApiRequest, NextApiResponse } from "next";
import { engineGet } from "@/lib/settle-client";

interface EnginePaymentStatus {
  reference: string;
  type: string;
  status: string;
  txHash?: string | null;
  confirmations: number | null;
  expiresAt?: string | null;
  updatedAt?: string | null;
}

interface EnginePaymentStatusResponse {
  success?: boolean;
  payment?: EnginePaymentStatus;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { reference } = req.query;

  if (typeof reference !== "string" || !reference.trim()) {
    return res.status(400).json({ ok: false, error: "reference is required" });
  }

  try {
    const result = await engineGet<EnginePaymentStatusResponse>(
      `/payments/${encodeURIComponent(reference.trim())}`,
    );

    if (!result.payment) {
      return res.status(404).json({ ok: false, error: "Payment not found" });
    }

    return res.status(200).json({
      ok: true,
      payment: {
        reference: result.payment.reference,
        type: result.payment.type,
        status: result.payment.status,
        txHash: result.payment.txHash ?? null,
        confirmations: result.payment.confirmations ?? null,
        expiresAt: result.payment.expiresAt ?? null,
        updatedAt: result.payment.updatedAt ?? null,
      },
    });
  } catch (error: any) {
    console.error("Payment status fetch error:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json(
      error?.response?.data ?? { ok: false, error: "Failed to fetch payment status" },
    );
  }
}
