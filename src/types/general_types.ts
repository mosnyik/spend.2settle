import { RowDataPacket } from "mysql2/promise";
import React from "react";

export type MessageType = {
  type: string;
  content: React.ReactNode;
  timestamp: Date;
};

//WALLET
export type EthereumAddress = `0x${string}` | undefined;

// RATES FROM THE VENDOR TABLE
export interface ExchangeRate {
  current_rate: number;
  merchant_rate: string;
  profit_rate: string;
}

// AXIOS SERVER RESPONSE TYPE
export interface ServerResponse {
  data: ServerData;
}

// AXIOS SERVERDATA TYPE
export interface ServerData {
  rate: string;
  merchantRate: string;
  profitRate: string;
  ytdVolume: string;
  dbVolume: string;
}

// USER FROM THE VENDOR TABLE
export interface vendorData {
  // agent_id?: string | null;
  phone_number?: string | null;
  bitcoin_wallet?: string | null;
  bitcoin_privateKey?: string | null;
  eth_bnb_wallet?: string | null;
  eth_bnb_privateKey?: string | null;
  tron_wallet?: string | null;
  tron_privateKey?: string | null;
}
export interface userData {
  crypto?: string | null;
  network?: string | null;
  estimation?: string | null;
  Amount?: string | null;
  charges?: string | null;
  mode_of_payment?: string | null;
  acct_number?: string | null;
  bank_name?: string | null;
  receiver_name?: string | null;
  receiver_amount?: string | null;
  receiver_phoneNumber?: string | null;
  crypto_sent?: string | null;
  wallet_address?: string | null;
  Date?: string | null;
  status?: string | null;
  customer_phoneNumber?: string | null;
  transac_id?: string | null;
  request_id?: string | null;
  settle_walletLink?: string | null;
  chat_id?: string | null;
  current_rate?: string | null;
  merchant_rate?: string | null;
  profit_rate?: string | null;
  name?: string | null;
  gift_status?: string | null;
  request_status?: string | null;
  gift_chatID?: string | null;
  asset_price?: string | null;
  ref_code?: string | null;
}

export interface ReferralUser {
  id: number;
  name: string;
  ref_code: string;
  responsibility: string;
  category: string;
  commission: string;
  phone_number: string;
}

// BANK DATA FROM NUBAN
export interface BankData {
  bank_name: string;
  account_name: string;
  account_number: string;
}

// BANK DATA FROM THE DB
export interface BankName extends RowDataPacket {
  bank_name: string;
  bank_code: string;
}

// STILL BANK DETAILS
export interface Result {
  name: string;
  code: string;
}

// USER BANK DATA TO BE PUSHED TO TRANSACTION DB
export interface UserBankData {
  acct_number?: string;
  bank_name?: string;
  receiver_name?: string;
}

export interface SharedStateContextProps {
  sharedState: string;
  setSharedState: React.Dispatch<React.SetStateAction<string>>;
  sharedRate: string;
  setSharedRate: React.Dispatch<React.SetStateAction<string>>;
  sharedChatId: string;
  setSharedChatId: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentMode: string;
  setSharedPaymentMode: React.Dispatch<React.SetStateAction<string>>;
  sharedCrypto: string;
  setSharedCrypto: React.Dispatch<React.SetStateAction<string>>;
  sharedTicker: string;
  setSharedTicker: React.Dispatch<React.SetStateAction<string>>;
  sharedNetwork: string;
  setSharedNetwork: React.Dispatch<React.SetStateAction<string>>;
  sharedWallet: string;
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>;
  sharedAssetPrice: string;
  setSharedAssetPrice: React.Dispatch<React.SetStateAction<string>>;
  sharedEstimateAsset: string;
  setSharedEstimateAsset: React.Dispatch<React.SetStateAction<string>>;
  sharedAmount: string;
  setSharedAmount: React.Dispatch<React.SetStateAction<string>>;
  sharedCharge: string;
  setSharedCharge: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentAssetEstimate: string;
  setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentNairaEstimate: string;
  setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>;
  sharedNairaCharge: string;
  setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>;
  sharedChargeForDB: string;
  setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>;
  sharedBankCodes: string[];
  setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>;
  sharedBankNames: string[];
  setSharedBankNames: React.Dispatch<React.SetStateAction<string[]>>;
  sharedSelectedBankCode: string;
  setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>;
  sharedSelectedBankName: string;
  setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>;
  bankData: UserBankData;
  updateBankData: (newData: Partial<UserBankData>) => void;
  sharedPhone: string;
  setSharedPhone: React.Dispatch<React.SetStateAction<string>>;
  sharedTransactionId: string;
  setSharedTransactionId: React.Dispatch<React.SetStateAction<string>>;
  sharedGiftId: string;
  setSharedGiftId: React.Dispatch<React.SetStateAction<string>>;
  sharedReportlyReportType: string;
  setSharedReportlyReportType: React.Dispatch<React.SetStateAction<string>>;
}

export interface WalletInfo {
  activeWallet: string;
  lastAssignedTime: string;
}
