import connection from "@/lib/mysql";
import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // const dbHost = process.env.host;
  // const dbUser = process.env.user;
  // const dbPassword = process.env.password;
  // const dbName = process.env.database;
  const { transac_id } = req.query;

  if (!transac_id) {
    return res.status(400).json({ message: "transac_id is required" });
  }

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    const [rows] = await connection.query<RowDataPacket[]>(
      // "SELECT * FROM `settle_database`.`2settle_transaction_table` WHERE `transac_id` = ?",
      "SELECT * FROM summary WHERE `transaction_id` = ?",
      [transac_id]
    );

    await connection.end();

    if (rows.length > 0) {
      res.status(200).json({ exists: true, user: rows[0] });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Server error");
  }
}
