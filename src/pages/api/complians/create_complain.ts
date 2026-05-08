import connection from "@/lib/mysql";
import mysql from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // const dbHost = process.env.host;
  // const dbUser = process.env.user;
  // const dbPassword = process.env.password;
  // const dbName = process.env.database;

  const {
    transaction_id,
    complain,
    status,
    Customer_phoneNumber,
    complain_id,
  } = req.body;

  const complainData = {
    transaction_id,
    complain,
    status,
    Customer_phoneNumber,
    complain_id,
  };

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    const query = "INSERT INTO complains SET ?";
    const [result] = await connection.query(query, complainData);

    await connection.end();

    res
      .status(200)
      .json({ message: "Complain data stored successfully", result });
  } catch (err) {
    console.error("Error storing user data:", err);
    res.status(500).send("Server error");
  }
}
