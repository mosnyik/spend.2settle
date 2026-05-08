import type { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";
import { formatPhoneNumber } from "@/utils/utilities";
import connection from "@/lib/mysql";

// TODO: we need to work on this
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
  const { phoneNumber, walletAddress, page = "1", limit = "10" } = query;

  if (!phoneNumber && !walletAddress) {
    return res.status(400).json({
      error: "At least one of phone number or wallet address is required",
    });
  }

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    let queryStr = `
      SELECT SQL_CALC_FOUND_ROWS * FROM payer 
      WHERE 1=1
    `;
    const queryParams: (string | number | null)[] = [];

    if (phoneNumber) {
      const phoneNo = formatPhoneNumber(phoneNumber as string);
      queryStr += " AND customer_phoneNumber = ?";
      queryParams.push(phoneNo);
    }

    if (walletAddress) {
      queryStr += " AND send_from = ?";
      queryParams.push(walletAddress as string);
    }

    queryStr += " LIMIT ? OFFSET ?";
    queryParams.push(limitNumber, offset);

    const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);
    const [countResult] = await db.query<RowDataPacket[]>(
      "SELECT FOUND_ROWS() as total"
    );
    const total = countResult[0].total;

    if (rows.length > 0) {
      return res.status(200).json({
        exists: true,
        transactions: rows,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(total / limitNumber),
          totalItems: total,
        },
      });
    } else {
      return res.status(404).json({
        exists: false,
        transactions: [],
        pagination: {
          currentPage: pageNumber,
          totalPages: 0,
          totalItems: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error checking user in database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
