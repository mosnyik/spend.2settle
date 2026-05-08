import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import connection from "@/lib/mysql";

// // Database connection configuration
// const dbConfig = {
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { referralCode } = req.body;

    try {
      // // Create a database connection
      // const connection = await mysql.createConnection(dbConfig);

      // Query the database
      const [rows] = await connection.execute(
        "SELECT * FROM referrals WHERE ref_code = ?",
        [referralCode]
      );

      // Close the database connection
      await connection.end();

      // Check if the referral exists
      if (Array.isArray(rows) && rows.length > 0) {
        // Referral exists
        res.status(200).json({ exists: true, user: rows[0] });
      } else {
        // Referral does not exist
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
