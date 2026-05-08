type PayerRow = {
  chat_id: string;
  customer_phoneNumber: string;
};

export type ReceiverRow = {
  acct_number?: string;
  bank_name?: string;
  receiver_name?: string;
  receiver_phoneNumber?: string;
  is_vendor?: boolean;
};

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
// wallet_address// status
export type TransferRow = {
  crypto?: string;
  network?: string;
  estimate_asset?: string;

  amount_payable?: string;
  crypto_amount?: string;
  estimate_amount?: string;

  charges?: string;

  date?: string | Date;
  transfer_id?: string;
  receiver_id?: string;
  payer_id?: string;

  current_rate?: string;
  merchant_rate?: string;
  profit_rate?: string;
  wallet_address?: string;
  status?: string;

  payer?: {
    chat_id?: string;
    customer_phoneNumber?: string;
  };

  reciever?: {
    acct_number?: string;
    bank_name?: string;
    receiver_name?: string;
    receiver_phoneNumber?: string;
    is_vendor?: boolean;
  };

  summary?: {
    transaction_type?: string;

    total_dollar?: string;
    total_naira?: string;

    effort?: string;
    merchant_id?: string;
    ref_code?: string;
    asset_price?: string;
    status?: string;
  };
};


export type GiftRow = {
  gift_id?: string;
  crypto?: string;
  network?: string;
  estimate_asset?: string;
  estimate_amount?: string;
  amount_payable?: string;
  charges?: string;
  crypto_amount?: string;
  date?: string | Date;
  receiver_id?: number;
  payer_id?: number;
  current_rate?: string;
  merchant_rate?: string;
  profit_rate?: string;
  wallet_address?: string;
  status?: string;
};

export type RequestRow = {
  request_id?: string;
  request_status?: string;
  crypto?: string;
  network?: string;
  estimate_asset?: string;
  estimate_amount?: string;
  amount_payable?: string;
  charges?: string;
  crypto_amount?: string;
  date?: string | Date;
  receiver_id?: number;
  payer_id?: number;
  current_rate?: string;
  merchant_rate?: string;
  profit_rate?: string;
  wallet_address?: string;
  status?: string;
};

export type SummaryRow = {
  total_dollar?: string;
  total_naira?: string;

  effort?: string;
  merchant_id?: number;
  ref_code?: string;
  asset_price?: string;
  status?: string;
};

// SUMMARY
// transaction_type
// total_dollar
// transaction_id
//total_naira
// effort
// merchant_id
// ref_code
// asset_price
// status
