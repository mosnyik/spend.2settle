import { saveGiftTransaction } from "@/services/transactionService/giftService/helpers/saveGift";
import { giftSchema } from "@/validation/schemas";
import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const giftId = await saveGiftTransaction(req.body);
//     return res.status(200).json({ giftId });
//   } catch (err: any) {
//     return res.status(500).json({ error: err.message });
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = giftSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid gift input",
      details: parsed.error.flatten(),
    });
  }

  try {
    const giftId = await saveGiftTransaction(parsed.data);
    return res.status(200).json({ giftId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
