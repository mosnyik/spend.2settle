import type { NextApiRequest, NextApiResponse } from "next";
import connection from "@/lib/mysql";
import { RowDataPacket } from "mysql2/promise";

interface PaymentStatusRow extends RowDataPacket {
  reference: string;
  type: string;
  status: string;
  tx_hash: string | null;
  confirmations: number | null;
  expires_at: Date | null;
  updated_at: Date;
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
    const [rows] = await connection.query<PaymentStatusRow[]>(
      `
        SELECT reference, type, status, tx_hash, confirmations, expires_at, updated_at
        FROM payment_sessions
        WHERE reference = ?
        LIMIT 1
      `,
      [reference],
    );

    const row = rows[0];

    if (!row) {
      return res.status(404).json({ ok: false, error: "Payment not found" });
    }

    return res.status(200).json({
      ok: true,
      payment: {
        reference: row.reference,
        type: row.type,
        status: row.status,
        txHash: row.tx_hash,
        confirmations: row.confirmations,
        expiresAt: row.expires_at ? row.expires_at.toISOString() : null,
        updatedAt: row.updated_at.toISOString(),
      },
    });
  } catch (error) {
    console.error("Payment status fetch error:", error);
    return res.status(500).json({ ok: false, error: "Failed to fetch payment status" });
  }
}
