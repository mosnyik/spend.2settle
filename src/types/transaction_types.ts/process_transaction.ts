export interface TransactionType {
  /** Identity */
  transfer_id?: string | null;
  request_id?: string | null;
  gift_id?: string | null;

  /** Status */
  status?: string | null;
  request_status?: string | null;
  gift_status?: string | null;

  /** Asset details */
  crypto?: string | null;
  network?: string | null;
  estimate_asset?: string | null;

  /** Amounts */
  estimate_amount?: string | null;
  amount_payable?: string | null;
  crypto_amount?: string | null;
  charges?: string | null;

  /** Rates */
  current_rate?: string | null;
  merchant_rate?: string | null;
  profit_rate?: string | null;

  /** Participants */
  receiver_id?: number | null;
  payer_id?: number | null;

  /** Wallet */
  wallet_address?: string | null;

  /** Time */
  date?: string | null;
}

//PAYER

/**
 * chat_id
 * phone
 * wallet
 */

//RECEIVER

/**
 * bank_name
 * bank_account
 * account_name
 * phone
 * is_vendor
 *
 */

//GIFT

/**
 * gift_id
 * status
 * crypto
 * network
 * estimate_asset
 * estimate_amount
 * amount_payable
 * charges
 * crypto_amount
 * date
 * reciever_id
 * gift_status
 * payer_id
 * current_rate
 * merchant_rate
 * profit_rate
 * wallet_address
 */

//SUMMARY

/**
 * transaction_type
 * total_dollar
 * settle_date
 * transaction_id
 * total_naira
 * effort
 * merchant_id
 * status
 * ref_code
 * asset_price
 */

// TRANSFER
/**
 * crypto
 * network
 * estimate_asset
 * amount_payable
 * crypto_amount
 * charges
 * date
 * transfer_id
 * reciever_id
 * payer_id
 * current_rate
 * profit_rate
 * estimate_amount
 * wallet_address
 */

// REQUEST

/**
 * request_id
 * request_status
 * crypto
 * network
 * estimate_asset
 * estimate_amount
 * amount_payable
 * charges
 * crypto_amount
 * date
 * receiver_id
 * payer_id
 * current_rate
 * merchant_rate
 * profite_rate
 * wallet_address
 */

// import { MessageType, UserBankData } from "../general_types";

// export interface TransactionParams {
//   phoneNumber: string;
//   isGift: boolean;
//   isGiftTrx: boolean;
//   requestPayment: boolean;
//   sharedPaymentMode: string;
//   sharedGiftId: string;
//   activeWallet?: string;
//   lastAssignedTime?: Date;
//   bankData: UserBankData;
//   addChatMessages: (messages: MessageType[]) => void;
//   setLoading: (loading: boolean) => void;
//   goToStep: (step: string) => void;
//   nextStep: (step: string) => void;
// }

// export interface BaseTransactionParams {
//   phoneNumber: string;
//   activeWallet?: string;
// }
