export type TransactionStatus =
  | "Processing"
  | "Cancel"
  | "Uncompleted"
  | "Unsuccessful"
  | "Successful";
export type BuilderTransaction = {
  crypto: string;
  network: string;
  estimation: string;
  Amount: string;
  effort: string;
  charges: string;
  mode_of_payment: string;
  acct_number: string | undefined;
  bank_name: string | undefined;
  receiver_name: string | undefined;
  receiver_amount: string;
  crypto_sent: string;
  wallet_address: string | undefined; // WalletAddress;
  Date: string;
  status: TransactionStatus;
  receiver_phoneNumber: string;
  customer_phoneNumber: string;
  transac_id: string;
  request_id: string;
  settle_walletLink: string;
  chat_id: string;
  current_rate: string;
  merchant_rate: string;
  profit_rate: string;
  name: string;
  asset_price: string;
  gift_status: TransactionStatus;
  gift_chatID: string;
  ref_code: string;
};
