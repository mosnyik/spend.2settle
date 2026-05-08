import { userData } from "@/types/general_types";
import { PaginationInfo } from "@/types/history_types";
import axios from "axios";
import twilio from "twilio";

// CHECK IF USER HAS HISTORY IN OUR DB RECORDS USING PHONE NUMBER OR WALLET, SO WE CAN POPULATE THEIR TRANSACTIONS ARRAY
// export const checkUserHasHistory = async (
//   phone?: string,
//   walletAddress?: string
// ): Promise<{ exists: boolean; transactions?: userData }> => {
//   if (!phone && !walletAddress) {
//     throw new Error("Either phone number or wallet address must be provided.");
//   }

//   try {
//     const response = await axios.get("/api/check_user", {
//       params: {
//         phoneNumber: phone || undefined,
//         walletAddress: walletAddress || undefined,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error checking user existence:", error);
//     throw error;
//   }
// };

export const checkUserHasHistory = async (
  phone?: string,
  walletAddress?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  exists: boolean;
  transactions?: userData;
  pagination: PaginationInfo;
}> => {
  if (!phone && !walletAddress) {
    throw new Error("Either phone number or wallet address must be provided.");
  }

  try {
    const response = await axios.get("/api/check_user", {
      params: {
        phoneNumber: phone || undefined,
        walletAddress: walletAddress || undefined,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

let lastOtpSentTime = 0;
const OTP_COOLDOWN = 3000;

export const sendOtp = async (
  phone: string
): Promise<{ sent: boolean; message?: string }> => {
  const currentTime = Date.now();

  // Check if enough time has passed since the last OTP was sent
  if (currentTime - lastOtpSentTime < OTP_COOLDOWN) {
    return {
      sent: false,
      message: `Please wait ${Math.ceil(
        (OTP_COOLDOWN - (currentTime - lastOtpSentTime)) / 1000
      )} seconds before requesting another OTP.`,
    };
  }

  try {
    const response = await axios.post("/api/send-otp", { phoneNumber: phone });

    if (response.data.success) {
      lastOtpSentTime = currentTime;
      return { sent: true };
    } else {
      return { sent: false, message: "Failed to send OTP. Please try again." };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      sent: false,
      message: "An error occurred while sending OTP. Please try again.",
    };
  }
};

// SEND OTP TO THE USER AS SMSs
export const sendOTPWithTwilio = async (
  phoneNumber: string
): Promise<string> => {
  try {
    const response = await fetch("/api/send_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }

    const data = await response.json();
    return data.otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
export const handlePhoneNumber = async (phoneNumber: string) => {
  // Check if phone number exists in the database
  // const hasHistory = await checkUserHasHistory(phoneNumber);

  // if (!hasHistory) {
  //   throw new Error("No history found for " + { phoneNumber });
  // }

  // Generate OTP
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Send OTP
  await sendOtp(phoneNumber);

  // return otp;
};
