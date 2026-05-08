import { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { gift_id } = req.query;

  if (!gift_id) {
    return res.status(400).json({ message: "gift_id is required" });
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

    // Query the database to get the receiver_amount for the given gift_chatID
    const [rows]: [RowDataPacket[], any] = await connection.query(
      "SELECT receiver_amount FROM `2settle_transaction_table` WHERE `gift_chatID` = ?",
      [gift_id]
    );

    // Close the database connection
    await connection.end();

    // Check if any rows were returned
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given gift_chatID" });
    }

    // Return the receiver_amount
    const receiverAmount = rows[0].receiver_amount;
    return res.status(200).json({ receiver_amount: receiverAmount });
  } catch (error) {
    console.error("Error fetching receiver_amount:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
