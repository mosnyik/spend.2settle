import mysql from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const dbHost = process.env.host;
  const dbUser = process.env.user;
  const dbPassword = process.env.password;
  const dbName = process.env.database;

  const { transac_id } = req.query;

  if (!transac_id) {
    return res.status(400).json({ error: "transac_id is required" });
  }

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const [result] = await connection.query<mysql.ResultSetHeader>(
      "DELETE FROM 2settle_transaction_table WHERE transac_id = ?",
      [transac_id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No transaction found with the provided transac_id" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).send("Server error");
  }
}
