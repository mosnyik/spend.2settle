import { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

type Network = "btc" | "eth" | "bnb" | "trx" | "erc20" | "bep20" | "trc20";

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

const WALLET_EXPIRY_TIME = 5 * 60 * 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { network } = req.query;

  if (!network || typeof network !== "string" || !isValidNetwork(network)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing network parameter" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const flagColumn = getFlagColumn(network);

    const query = `
    SELECT *
    FROM wallets
    WHERE TRIM(${flagColumn}) IN ('true', 1, true)
    LIMIT 1
    FOR UPDATE`;

    const [rows] = await connection.query<RowDataPacket[]>(query);

    if (rows.length === 0) {
      const [lastAssignedRows] = await connection.query<RowDataPacket[]>(
        `SELECT
            MIN(CASE WHEN bitcoin_flag = 'false' THEN bitcoin_last_assigned END) as btc_last_assigned,
            MIN(CASE WHEN ethereum_flag = 'false' THEN ethereum_last_assigned END) as eth_last_assigned,
            MIN(CASE WHEN binance_flag = 'false' THEN binance_last_assigned END) as bnb_last_assigned,
            MIN(CASE WHEN erc20_flag = 'false' THEN erc20_last_assigned END) as erc20_last_assigned,
            MIN(CASE WHEN bep20_flag = 'false' THEN bep20_last_assigned END) as bep20_last_assigned,
            MIN(CASE WHEN tron_flag = 'false' THEN tron_last_assigned END) as trx_last_assigned,
            MIN(CASE WHEN trc20_flag = 'false' THEN trc20_last_assigned END) as trc20_last_assigned
          FROM wallets`
      );

      const nearestExpiry = getNearestExpiry(lastAssignedRows[0], network);

      await connection.rollback();
      connection.release();

      if (nearestExpiry) {
        const waitTime = Math.max(
          0,
          nearestExpiry.getTime() + WALLET_EXPIRY_TIME - Date.now()
        );
        const waitTimeMinutes = Math.ceil(waitTime / (60 * 1000));
        return res.status(503).json({
          message: `It is an up time for ${network} transactions. You would need to wait and try again in ${waitTimeMinutes} minute${
            waitTimeMinutes !== 1 ? "s" : ""
          }.`,
        });
      } else {
        return res
          .status(404)
          .json({ message: `No active wallet found for ${network}` });
      }
    }

    const wallet = rows[0];

    const activeWallet = getWalletForNetwork(wallet, network);
    const flagToUpdate = getFlagColumn(network);
    const lastAssignedColumn = getLastAssignedColumn(network);

    if (activeWallet) {
      const lastAssignedTime = new Date();

      await connection.query(
        `UPDATE wallets SET ${flagToUpdate} = ?, ${lastAssignedColumn} = ? WHERE ${getWalletColumn(
          network
        )} = ?`,
        [0, lastAssignedTime, activeWallet]
      );

      await connection.commit();
      connection.release();

      return res.status(200).json({ activeWallet, lastAssignedTime });
    } else {
      await connection.rollback();
      connection.release();
      return res
        .status(404)
        .json({ message: `No active wallet found for ${network}` });
    }
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Database query error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function isValidNetwork(network: string): network is Network {
  return ["btc", "eth", "bnb", "trx", "erc20", "bep20", "trc20"].includes(
    network
  );
}

function getFlagColumn(network: Network): string {
  switch (network) {
    case "bep20":
      return "bep20_flag";
    case "trc20":
      return "trc20_flag";
    case "btc":
      return "bitcoin_flag";
    case "eth":
      return "ethereum_flag";
    case "bnb":
      return "binance_flag";
    case "trx":
      return "tron_flag";
    case "erc20":
      return "erc20_flag";
  }
}

function getWalletColumn(network: Network): string {
  switch (network) {
    case "btc":
      return "bitcoin";
    case "eth":
    case "bnb":
    case "erc20":
    case "bep20":
      return "evm";
    case "trx":
    case "trc20":
      return "tron";
  }
}

function getLastAssignedColumn(network: Network): string {
  switch (network) {
    case "btc":
      return "bitcoin_last_assigned";
    case "eth":
      return "ethereum_last_assigned";
    case "bnb":
      return "binance_last_assigned";
    case "trx":
      return "tron_last_assigned";
    case "erc20":
      return "erc20_last_assigned";
    case "bep20":
      return "bep20_last_assigned";
    case "trc20":
      return "trc20_last_assigned";
  }
}

function getWalletForNetwork(
  wallet: RowDataPacket,
  network: Network
): string | null {
  switch (network) {
    case "btc":
      return wallet.bitcoin;
    case "eth":
    case "bnb":
    case "erc20":
    case "bep20":
      return wallet.evm;
    case "trx":
    case "trc20":
      return wallet.tron;
    default:
      return null;
  }
}

function getNearestExpiry(
  lastAssignedData: RowDataPacket,
  network: Network
): Date | null {
  let relevantLastAssigned: Date | null = null;

  switch (network) {
    case "btc":
      relevantLastAssigned = lastAssignedData.btc_last_assigned;
      break;
    case "eth":
      relevantLastAssigned = lastAssignedData.eth_last_assigned;
      break;
    case "bnb":
      relevantLastAssigned = lastAssignedData.bnb_last_assigned;
      break;
    case "erc20":
      relevantLastAssigned = lastAssignedData.erc20_last_assigned;
      break;
    case "bep20":
      relevantLastAssigned = lastAssignedData.bep20_last_assigned;
      break;
    case "trx":
      relevantLastAssigned = lastAssignedData.trx_last_assigned;
      break;
    case "trc20":
      relevantLastAssigned = lastAssignedData.trc20_last_assigned;
      break;
  }

  return relevantLastAssigned ? new Date(relevantLastAssigned) : null;
}
