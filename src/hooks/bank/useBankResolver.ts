import { useState, useCallback } from "react";
import axios from "axios";
import { BankName } from "@/types/general_types";

const apiURL = process.env.NEXT_PUBLIC_API_URL;


export function useBankResolver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  // 1. Fetch bank names from your own API

  const fetchBankNames = useCallback(
    async (extracted: string): Promise<BankName> => {
      try {
        const response = await axios.post<BankName>(
          `${apiURL}/api/banks/bank_names/`,
          { message: extracted }
        );
        return response.data;
      } catch (err) {
        console.error("Error fetching bank names:", err);
        throw new Error("Failed to fetch bank names");
      }
    },
    []
  );


  // 2. Query NUBAN API for bank details
 
  const fetchBankDetails = useCallback(
    async (bank_code: string, acc_no: string): Promise<any | null> => {
      try {
        const response = await axios.get(
          `https://app.nuban.com.ng/api/NUBAN-WBODZCTK1831?bank_code=${bank_code}&acc_no=${acc_no}`
        );
        return response.data;
      } catch (err) {
        console.error(
          `Error fetching bank details for bank code ${bank_code} and account number ${acc_no}:`,
          err
        );
        return null;
      }
    },
    []
  );


  // 3. Resolve → bank names → clean → bank code → NUBAN lookup

  const resolveBankAccount = useCallback(
    async (bank_name: string, acc_no: string): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const bank = await fetchBankNames(bank_name);
        const text = bank.message[0]; // e.g. "1. OPAY 100004"

        // Remove leading number: "1. "
        const cleanText = text.replace(/^\d+\.\s*/, "");

        // Split into name + code
        const parts = cleanText.split(" ");
        const bankCode = parts[parts.length - 1]; // "100004"

        const bank_details = await fetchBankDetails(bankCode, acc_no);
        return bank_details?.[0]?.account_name || null;
      } catch (err: any) {
        setError("Failed to resolve bank account");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchBankNames, fetchBankDetails]
  );

  return {
    loading,
    error,
    fetchBankNames,
    fetchBankDetails,
    resolveBankAccount,
  };
}
