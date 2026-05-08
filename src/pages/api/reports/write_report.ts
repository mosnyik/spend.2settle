import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next/types";

type Data = {
  message: string;
};

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    name,
    phone_Number,
    wallet_address,
    fraudster_wallet_address,
    description,
    complaint,
    status,
    report_id,
    confirmer,
  } = req.body;

  if (
    !name &&
    !phone_Number &&
    !wallet_address &&
    !fraudster_wallet_address &&
    !description &&
    !complaint &&
    !status &&
    !report_id &&
    !confirmer
  ) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided" });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const query = `
      INSERT INTO reports
        (name, phone_Number, wallet_address, fraudster_wallet_address, description, complaint, status, report_id, confirmer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name || null,
      phone_Number || null,
      wallet_address || null,
      fraudster_wallet_address || null,
      description || null,
      complaint || null,
      status || null,
      report_id || null,
      confirmer || null,
    ];

    const [result] = await connection.query(query, values);
    await connection.commit();

    if ((result as any).affectedRows !== 1) {
      throw new Error("Failed to insert the report");
    }

    res.status(200).json({ message: "Report successfully saved" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Error saving report" });
    throw new Error("Failed to save report: " + (error as Error).message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
