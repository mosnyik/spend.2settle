import pool from "@/lib/mysql";
import { useUserStore } from "stores/userStore";
import {
  getOrCreatePayer,
  GiftRow,
  insertGift,
  insertSummary,
} from "../../transactionService";
import { generateTransactionId } from "@/utils/utilities";

export const saveGiftTransaction = async (giftObj: GiftRow) => {
  // GIFT
  // gift_id
  // crypto
  // network
  // estimate_asset
  // estimate_amount
  // amount_payable
  // charges
  // crypto_amount
  // date
  // receiver_id
  // gift_status
  // payer_id
  // current_rate
  // merchant_rate
  // profit_rate
  // wallet_address
  // status

  const { payer, summary } = giftObj;

  if (!payer) {
    throw new Error("Payer is required");
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const payerId = await getOrCreatePayer(connection!, payer);

    if (!payerId) {
      throw new Error("Invalid payer details");
    }

    const giftId = await insertGift(connection, giftObj, payerId);

    await insertSummary(connection, summary!, parseInt(giftObj.gift_id!), "gift");

    await connection.commit();
    return giftId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};

