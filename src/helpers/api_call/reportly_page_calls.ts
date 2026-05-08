import { reportData } from "@/types/reportly_types";
import axios from "axios";

// CHECK IF USER HAS REPORTS IN OUR DB RECORDS USING PHONE NUMBER OR WALLET, SO WE CAN POPULATE THEIR REPORTS ARRAY
export const checkUserReports = async (
  phone?: string,
  walletAddress?: string
): Promise<{ exists: boolean; reports?: reportData }> => {
  if (!phone && !walletAddress) {
    throw new Error("Either phone number or wallet address must be provided.");
  }

  try {
    const response = await axios.get("/api/check_user_reports", {
      params: {
        phoneNumber: phone || undefined,
        walletAddress: walletAddress || undefined,
      },
    });
    console.log("Report:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export const getLastReportId = async () => {
  try {
    const response = await axios.get("/api/get_last_report_id");

    if (response.status === 200) {
      const data = response.data;
      console.log("Last Report ID:", data.report_id);
      return data.report_id;
    } else {
      console.error("Error:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
};

export const makeAReport = async (reportData: reportData) => {
  try {
    const response = await axios.post("/api/write_report", reportData);

    if (response.status === 200) {
      console.log("Report successfully submitted:", response.data.message);
    } else {
      console.error("Error submitting report:", response.data.message);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export const getNextReportID = (reportString: string): string => {
  const regex = /(\d+)$/;
  const match = reportString.match(regex);

  if (match) {
    const numberPart = match[1];
    const incrementedNumber = (parseInt(numberPart, 10) + 1)
      .toString()
      .padStart(numberPart.length, "0");

    console.log(incrementedNumber);
    return incrementedNumber;
  }

  return "";
};

export function isValidWalletAddress(address: string): boolean {
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  const btcP2PKHRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const btcBech32Regex = /^bc1([a-zA-HJ-NP-Z0-9]{25,39})$/;
  const tronRegex = /^T[a-zA-Z0-9]{33}$/;

  return (
    ethereumRegex.test(address) ||
    btcP2PKHRegex.test(address) ||
    btcBech32Regex.test(address) ||
    tronRegex.test(address)
  );
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "").length;
}


