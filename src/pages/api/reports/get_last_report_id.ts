import type { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

type Data = {
  report_id?: string;
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
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT report_id 
      FROM reports 
      ORDER BY report_id DESC 
      LIMIT 1
    `);

  
    if (rows.length > 0) {
      const lastReportId = rows[0].report_id;
      await db.end();
      return res
        .status(200)
        .json({ report_id: lastReportId, message: "Success" });
    } else {
      await db.end(); 
      return res.status(404).json({ message: "No reports found" });
    }
  } catch (error) {
    console.error("Error fetching last report_id:", error);
    await db.end(); 
    return res.status(500).json({ message: "Error fetching last report_id" });
  }
}
