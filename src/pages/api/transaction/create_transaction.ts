// // TODO: We have to split this into the individual transaction types

// import {
//   getOrCreatePayer,
//   getOrCreateReceiver,
//   insertSummary,
//   insertTransfer,
// } from "@/services/transactionService/transactionService";
// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const userData = req.body;

//   try {
//     async function processTransactions(data: any[]) {
//       for (const row of data) {
//         try {
//           const payerId = await getOrCreatePayer(row);
//           const receiverId = await getOrCreateReceiver(row);

//           if (!receiverId) continue;

//           const transferId = await insertTransfer(row, receiverId, payerId);
//           await insertSummary(row, transferId, "transfer");
//         } catch (err) {
//           console.error("Transaction Error:", err);
//         }
//       }
//     }

//     // ✅ Process transfers if it's an array
//     if (Array.isArray(userData)) {
//       await processTransactions(userData);
//     }

//     res.status(200).json({
//       message: "User data stored successfully",
//     });
//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

import {
  getOrCreatePayer,
  getOrCreateReceiver,
  insertSummary,
  insertTransfer,
} from "@/services/transactionService/transactionService";

import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import pool from "@/lib/mysql"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const userData = req.body;

  if (!Array.isArray(userData)) {
    return res.status(400).json({ message: "Expected an array of rows" });
  }

  let conn: mysql.Connection | null = null;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    for (const row of userData) {
      try {
        const payerId = await getOrCreatePayer(conn, row);
        const receiverId = await getOrCreateReceiver(conn, row);

        if (!receiverId) {
          throw new Error("Invalid receiver");
        }

        const transferId = await insertTransfer(conn, row, receiverId, payerId);
        await insertSummary(conn, row, transferId, "transfer");
      } catch (err) {
        // Rollback and throw to stop processing
        await conn.rollback();
        throw err;
      }
    }

    await conn.commit();

    return res.status(200).json({
      message: "All transactions processed successfully",
    });
  } catch (err) {
    if (conn) await conn.rollback();

    console.error("Server Error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.end();
  }
}

