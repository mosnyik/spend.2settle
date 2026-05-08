import { saveTransferTransaction } from "@/services/transactionService/transferService/helpers/saveTransfer";
import { transferSchema } from "@/validation/schemas";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = transferSchema.safeParse(req.body);

  if (!parsed.success) {
    console.error("Transfer validation failed:", JSON.stringify(parsed.error.flatten(), null, 2));
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten(),
    });
  }

  try {
    const transferId = await saveTransferTransaction(parsed.data);
    return res.status(200).json({ transferId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
