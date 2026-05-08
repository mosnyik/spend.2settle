
import type { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";
// TODO: We have work to do in this
// Create a connection pool (replace with your actual DB credentials)
const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { pin, phoneNumber, walletAddress } = req.body;

  // Ensure at least one of the inputs is provided
  if (!(phoneNumber && pin) && !walletAddress) {
    return res
      .status(400)
      .json({ error: "Phone number and pin or wallet address are required" });
  }

  try {
    // Construct the query and query parameters based on the provided inputs
    let queryStr = `
      SELECT * FROM payer 
      WHERE 1=1
    `;
    const queryParams: (string | null)[] = [];

    if (phoneNumber && pin) {
      queryStr += " AND phone = ? AND pin_hash = ?";
      queryParams.push(phoneNumber as string, pin as string);
    }

    if (walletAddress) {
      queryStr += " AND wallet_address = ?";
      queryParams.push(walletAddress as string);
    }

    // Execute the query
    const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);

    // Check if any rows were returned
    if (rows.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "User verified", user: rows[0] });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
