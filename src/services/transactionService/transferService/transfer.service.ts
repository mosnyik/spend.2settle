import api from "../../api-client";
import { TransferRow } from "../transactionService";
export const createTransfer = async (transferData: TransferRow): Promise<any> => {
  try {
    const response = await api.post<any>(`/api/transfer/save`, transferData);
    console.log("Use transfer created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing transferData data:", error);
    throw new Error("Failed to store transferData data");
  }
};
