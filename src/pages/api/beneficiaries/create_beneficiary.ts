import connection from "@/lib/mysql";
import mysql from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

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
        beneficiary_acctNO,
        beneficiary_acctName,
        beneficiary_bankName,
        beneficiary_nickname,
        beneficiary_phoneNumber
   
  } = req.body;

  const beneficiaryData = {
        beneficiary_acctNO,
        beneficiary_acctName,
        beneficiary_bankName,
        beneficiary_nickname,
        beneficiary_phoneNumber
  };

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    const query = "INSERT INTO beneficiaries SET ?";
    const [result] = await connection.query(query, beneficiaryData);

    // await connection.end();

    res.status(200).json({ message: "User data stored successfully", result });
  } catch (err) {
    console.error("Error storing user data:", err);
    res.status(500).send("Server error");
  }
}
