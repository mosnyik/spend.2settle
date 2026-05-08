import connection from "@/lib/mysql";
import { BankName } from "@/types/general_types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  //   const dbHost = process.env.host;
  //   const dbUser = process.env.user;
  //   const dbPassword = process.env.password;
  //   const dbName = process.env.database;

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    const { message: extracted } = req.body;
    if (!extracted)
      return res.status(400).json({ message: "Bank search word not provided" });

    const [results] = await connection.query<BankName[]>(
      // "SELECT * FROM 2settle_bank_details WHERE bank_name LIKE ?",
      "SELECT * FROM banks WHERE name LIKE ?",
      [`${extracted}%`]
    );

    // await connection.end();

    if (results.length > 0) {
      const bank_names = results.map(
        (row, index) => `${index + 1}. ${row.name} ${row.code}`
      );
      res.status(200).json({ message: bank_names });
    } else {
      res.status(404).json({ message: "Bank not found. Try again" });
    }
  } catch (err) {
    console.error(
      "Error querying the 2settle_bank_details from database:",
      err
    );
    res.status(500).send("Server error");
  }
}
