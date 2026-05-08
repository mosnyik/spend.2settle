import type { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";
import { formatPhoneNumber } from "@/utils/utilities";
import connection from "@/lib/mysql";

const db = connection;
// mysql.createPool({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { phoneNumber, walletAddress } = query;

  if (!phoneNumber && !walletAddress) {
    return res.status(400).json({
      error: "At least one of phone number or wallet address is required",
    });
  }

  try {
    // let queryStr = `
    //   SELECT * FROM settle_database.2settle_report_table 
    //   WHERE 1=1
    // `;
    let queryStr = `
      SELECT * FROM reports 
      WHERE 1=1
    `;
    const queryParams: (string | null)[] = [];

    if (phoneNumber) {
      const phoneNo = formatPhoneNumber(phoneNumber as string);
      queryStr += " AND phone_Number = ?";
      queryParams.push(phoneNo);
    }

    if (walletAddress) {
      queryStr += " AND wallet_address = ?";
      queryParams.push(walletAddress as string);
    }

    const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);

   
    if (rows.length > 0) {
      await db.end();
      return res.status(200).json({ exists: true, reports: rows });
    } else {
      await db.end();
      return res.status(404).json({ exists: false, reports: [] });
    }
  } catch (error) {
    await db.end();
    console.error("Error fetching user reports in database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
