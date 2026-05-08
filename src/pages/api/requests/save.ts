import { saveRequestTransaction } from "@/services/transactionService/requestService/helpers/saveRequest";
import { requestSchema } from "@/validation/schemas";
import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const requestId = await saveRequestTransaction(req.body);
//     return res.status(200).json({ requestId });
//   } catch (err: any) {
//     return res.status(500).json({ error: err.message });
//   }
// }

const normalize = (obj: any) =>
  JSON.parse(JSON.stringify(obj, (_, v) => (v === "" ? undefined : v)));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  const parsed = requestSchema.safeParse(normalize(req.body));

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request input",
      details: parsed.error.flatten(),
    });
  }

  try {
    const requestId = await saveRequestTransaction(parsed.data);
    return res.status(200).json({ requestId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
