import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// Mapping input strings to DB column names
const walletColumnMap: Record<string, string> = {
  btc: "bitcoin",
  eth: "evm",
  bnb: "evm",
  erc20: "evm",
  bep20: "evm",
  trx: "tron",
  trc20: "tron",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, id } = req.query;

  if (typeof type !== "string" || typeof id !== "string") {
    return res.status(400).json({
      message:
        "Invalid or missing query parameters: 'type' and 'id' are required.",
    });
  }

  const column = walletColumnMap[type.toLowerCase()];
  if (!column) {
    return res.status(400).json({
      message: "Invalid wallet type. Use 'btc', 'eth', 'bnb', or 'trx'.",
    });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT \`${column}\` AS wallet FROM wallets WHERE id = ?`,
      [id],
    );

    if (rows.length === 0 || !rows[0].wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for the given ID and type." });
    }

    return res.status(200).json({ wallet: rows[0].wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
