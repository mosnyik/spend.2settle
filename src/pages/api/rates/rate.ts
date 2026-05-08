import { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";
import connection from "@/lib/mysql";
import { ExchangeRate } from "@/types/general_types";

export default async function handler(
  req: NextApiRequest,

  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const [results] = await connection.execute<RowDataPacket[]>(
      "SELECT * FROM rates"
    );

    const result = results[0] as ExchangeRate;
    const raw = result.current_rate;
    const array_rate = raw.toString();
    const numRate = Number(array_rate);
    const percentage = 0.8;
    const increase = (percentage / 100) * numRate;
    const rate = numRate - increase;
    const data = rate.toLocaleString();

    res.status(200).json({ rate: data });
  } catch (err) {
    console.error("Error querying the rate from rates:", err);
    res
      .status(500)
      .send("Server error, try again later or contact the tech team");
  }
}
