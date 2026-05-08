import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { transac_id, status } = req.body;

  if (!transac_id || !status) {
    return res
      .status(400)
      .json({ message: "Transaction ID and status are required" });
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

    // TODO: this have to update a specifice type of transaction eg tranfer, gift, request
    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "UPDATE `settle_database`.`2settle_transaction_table` SET `status` = ? WHERE `transac_id` = ?",
      [status, transac_id]
    );

    await connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Status updated successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Server error");
  }
}
