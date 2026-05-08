import type { NextApiRequest, NextApiResponse } from "next";
import { enginePost } from "@/lib/settle-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await enginePost("/payments", req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Payment creation error:", error?.response?.data ?? error);
    return res.status(error?.response?.status ?? 500).json(
      error?.response?.data ?? { error: "Failed to create payment" }
    );
  }
}
