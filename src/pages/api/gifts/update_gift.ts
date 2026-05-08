// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import connection from "@/lib/mysql";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { gift_chatID, ...fieldsToUpdate } = req.body;

//   if (!gift_chatID) {
//     return res.status(400).json({ message: "Gift Chat ID is required" });
//   }

//   if (Object.keys(fieldsToUpdate).length === 0) {
//     return res.status(400).json({ message: "No fields to update" });
//   }

//   try {

//     // add reciever to the reciever table if not exists
//     // then update the gift with the receiver_id

//     // Dynamically build the query
//     const setClause = Object.keys(fieldsToUpdate)
//       .map((field) => `${field} = ?`)
//       .join(", ");
//     const values = Object.values(fieldsToUpdate);

//     const query = `UPDATE gifts SET ${setClause} WHERE gift_id = ?`;

//     const [result] = await connection.execute<mysql.ResultSetHeader>(query, [
//       ...values,
//       gift_chatID,
//     ]);

//     if (result.affectedRows > 0) {
//       res.status(200).json({ message: "Transaction updated successfully" });
//     } else {
//       res.status(404).json({ message: "Transaction not found" });
//     }
//   } catch (err) {
//     console.error("Error updating the database:", err);
//     res.status(500).send("Server error");
//   }
// }
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import pool from "@/lib/mysql";
import { giftUpdateSchema } from "@/validation/schemas";
import { getOrCreateReceiver } from "@/services/transactionService/transactionService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const parsed = giftUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid update input",
      details: parsed.error.flatten(),
    });
  }

  const { gift_id, receiver, giftUpdates } = parsed.data;

  let conn: mysql.Connection | null = null;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    if (receiver) {
     
    const receiverId = await getOrCreateReceiver(conn, receiver);

     if (receiverId === null) {
       throw new Error("Invalid receiver details");
     }

     giftUpdates.receiver_id = receiverId;
   }

    const setClause = Object.keys(giftUpdates)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = Object.values(giftUpdates);

    const query = `
      UPDATE gifts
      SET ${setClause}
      WHERE gift_id = ?
    `;

    const [result] = await conn.execute<mysql.ResultSetHeader>(query, [
      ...values,
      gift_id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("Gift not found");
    }

    await conn.commit();

    return res.status(200).json({
      message: "Gift updated successfully",
    });
  } catch (err: any) {
    if (conn) await conn.rollback();
    return res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.end();
  }
}
