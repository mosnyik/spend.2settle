import pool from "@/lib/mysql";
import {
  getOrCreatePayer,
  getOrCreateReceiver,
  insertSummary,
  insertTransfer,
  TransferRow,
} from "../../transactionService";

export const saveTransferTransaction = async (transferObj: TransferRow) => {
  const connection = await pool.getConnection();

  const { payer, receiver, summary } = transferObj;

  if (!payer) {
    throw new Error("Payer is required");
  }

  if (!receiver) {
    throw new Error("Receiver is required");
  }

  try {
    await connection.beginTransaction();

    const payerId = await getOrCreatePayer(connection, payer);

    const receiverId = await getOrCreateReceiver(connection, receiver);

    if (!receiverId) {
      throw new Error("Invalid receiver details");
    }
    // TRANSFER
    // crypto
    // network
    // estimate_asset
    // amount_payable
    // crypto_amount
    // charges
    // date
    // transfer_id
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // estimate_amount
    // wallet_address
    // status

    const transferId = await insertTransfer(
      connection!,
      transferObj,
      receiverId!,
      payerId,
    );

    await insertSummary(connection!, summary!, parseInt(transferObj.transfer_id!), "transfer");

    //SUMMARY
    // transaction_type
    //total_dollar
    // transaction_id
    //total_naira
    // effort
    // merchant_id
    // ref_code
    // asset_price

    await connection.commit();
    return transferId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};
