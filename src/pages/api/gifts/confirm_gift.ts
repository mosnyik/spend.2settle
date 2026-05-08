import connection from "@/lib/mysql";
import { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

//TODO: I dont think we need this anymore
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


  try {

    const query = `
      SELECT
        *
      FROM
        gifts
      WHERE
        gift_id = ?
      AND
        status = ('Successful', 'Processing', 'UnSuccessful', 'Uncompleted', 'cancel')
      AND
        gift_status IN ('pending', 'Not claimed', 'Claimed')
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [gift_id]);

    if (rows.length > 0) {
      // If there are rows, return them along with their statuses
      const result = rows.map((row) => ({
        status: row.status,
        gift_status: row.gift_status,
        transaction: row,
      }));

      console.log({ result });
      res.status(200).json({ exists: true, transactions: result });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Server error");
  }
}
