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

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "DELETE FROM 2settle_transaction_table WHERE transac_id IS NULL OR current_rate IS NULL OR merchant_rate IS NULL"
    );

    await connection.end();

    res.status(200).json({
      message: "Rows deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).send("Server error");
  }
}
