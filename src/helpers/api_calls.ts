import axios from "axios";
import {
  BankName,
  ReferralUser,
  userData,
  WalletInfo,
} from "../types/general_types";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

export const checkReferralExists = async (
  referralCode: string
): Promise<{ exists: boolean; user?: ReferralUser }> => {
  try {
    const response = await axios.post("/api/referral", {
      referralCode: referralCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking referral existence:", error);
    throw error;
  }
};

// GET THE AVAILABLE WALLET FROM DB
export const getAvaialableWallet = async (
  network: string
): Promise<WalletInfo> => {
  try {
    const response = await axios.get(
      `${apiURL}/api/transaction/get_available_wallet`,
      {
        params: { network: network },
      }
    );

    if (response.status === 200 && response.data.activeWallet) {
      console.log(
        `Available wallet for ${network}:`,
        response.data.activeWallet
      );
      return {
        activeWallet: response.data.activeWallet,
        lastAssignedTime: response.data.lastAssignedTime,
      };
    } else {
      console.log("The error status is:", response.status);
      throw new Error(
        `No wallet found for network: ${network} error is ${response.status}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.error(`No active wallet found for network ${network}`);
        throw new Error(`No active wallet available for network: ${network}`);
      } else if (error.response.status === 503) {
        let waitTime = "a few";
        if (error.response?.data?.message) {
          const match = error.response.data.message.match(/\d+/);
          if (match && match[0] !== "0") {
            waitTime = match[0];
          }
        }
        throw new Error(
          `Ops!! you will have to wait a little longer. Please try again in ${waitTime} seconds.`
        );
      } else {
        console.error(
          `API error for network ${network}:`,
          error.response.data.message
        );
        throw new Error(`API error for network: ${network}`);
      }
    } else {
      console.error(`Error fetching wallet for network ${network}:`, error);
      throw new Error(`Failed to fetch wallet for network: ${network}`);
    }
  }
};

export const getDirectDebitWallet = async (type: string): Promise<string> => {
  const serial_id = 1;

  try {
    const response = await axios.get(
      "/api/transaction/get_direct_debit_wallet",
      {
        params: { type, id: serial_id },
      }
    );

    if (response.status === 200) {
      console.log("Wallet is:", response.data.wallet);
      return response.data.wallet;
    } else if (response.status === 404) {
      return "Wallet not found";
    } else if (response.status === 500) {
      return "Internal error occurred";
    }

    return "Unexpected response";
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    return "Unexpected response from server";
  }
};

export const isGiftValid = async (
  gift_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/gifts/confirm_gift", {
      params: { gift_id },
    });

    if (response.data.exists && response.data.transactions.length > 0) {
      // Extract the first transaction as the userData object
      const firstTransaction: userData =
        response.data.transactions[0].transaction;

      // Return the exists flag and the user object
      return { exists: true, user: firstTransaction };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error checking gift validity:", error);
    throw error;
  }
};

// CREATE TRANSACTION IN THE TRANSACTION TABLE

export const createTransaction = async (user: any): Promise<any> => {
  try {
    // `${apiURL}/api/transaction/create_transaction`,
    console.log("Use transaction created successfully...................");
 const response = await axios.post(
   "http://localhost:3000/v1/payments",
   {
     type: "transfer",
     fiatAmount: 10000,
     fiatCurrency: "NGN",
     crypto: "USDT",
     network: "trc20",
     payer: {
       chatId: "telegram_123456",
     },
     receiver: {
       bankCode: "044",
       accountNumber: "0123456789",
       accountName: "John Doe",
     },
   },
   {
     headers: {
       Authorization: "your-secure-admin-secret-here",
       "Content-Type": "application/json",
     },
   },
 );
    console.log("Use transaction created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

export const createBeneficiary = async (user: any): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${apiURL}/api/beneficiaries/create_beneficiary`,
      user
    );
    console.log("Use transaction created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

// CREATE TRANSACTION IN THE TRANSACTION TABLE
export const createComplain = async (complainData: any): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${apiURL}/api/complains/create_complain`,
      complainData
    );
    console.log("Use complain created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

// FETCH COIN CURRENT PRICE (FROM BINACE TICKER)
export async function fetchCoinPrice(ticker: string): Promise<number> {
  try {
    const response = await fetch(`${apiURL}/api/crypto/get_coin_price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticker }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.price !== "number") {
      throw new Error("Invalid response structure");
    }

    console.log("Coin price:", data.price);
    return data.price;
  } catch (error) {
    console.error("Error fetching coin price:", error);
    throw error;
  }
}

