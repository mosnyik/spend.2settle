import { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";
import connection from "@/lib/mysql";
import { ExchangeRate } from "@/types/general_types";

export default async function handler(
  req: NextApiRequest,

  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // const dbHost = process.env.host;
  // const dbUser = process.env.user;
  // const dbPassword = process.env.password;
  // const dbName = process.env.database;

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    const [results] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM rates"
    );

    const result = results[0] as ExchangeRate;

    const profitRate = result.profit_rate;


    res.status(200).json({ profitRate: profitRate });
  } catch (err) {
    console.error("Error querying the merchant profit rate from rates:", err);
    res
      .status(500)
      .send("Server error, try again later or contact the tech team");
  }
}
