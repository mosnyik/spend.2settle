import pool from "@/lib/mysql";
import { useBankStore } from "stores/bankStore";
import { useUserStore } from "stores/userStore";
import {
  getOrCreateReceiver,
  insertRequest,
  insertSummary,
  RequestRow,
} from "../../transactionService";
import { generateTransactionId } from "@/utils/utilities";

export const saveRequestTransaction = async (requestObj: RequestRow) => {
  // REQUEST
  // request_id
  // request_status
  // crypto
  // network
  // estimate_asset
  // estimate_amount
  // amount_payable
  // charges
  // crypto_amount
  // date
  // receiver_id
  // payer_id
  // current_rate
  // merchant_rate
  // profit_rate
  // wallet_address
  // status

  // RECEIVER
  // bank name
  // account number
  // account name
  // phone number

  const { receiver, summary } = requestObj;

  if (!receiver) {
    throw new Error("Receiver is required");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const receiverId = await getOrCreateReceiver(connection!, receiver);

    const requestId = await insertRequest(connection!, requestObj, receiverId!);

    await insertSummary(
      connection,
      summary!,
      parseInt(requestObj.request_id!),
      "request",
    );

    await connection.commit();
    return requestId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};
