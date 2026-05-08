import { userData } from "@/types/general_types";
import api from "../../api-client";
import { RequestRow } from "../transactionService";

export const isRequestValid = async (
  request_id: string,
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await api.get("/api/requests/check_request", {
      params: { request_id },
    });

    const payment = response.data?.payment;

    if (response.data?.success && payment && payment.type === "request") {
      return {
        exists: true,
        user: {
          request_status: payment.status, // e.g. "pending", "confirmed", "settled"
          ...payment,
        } as userData,
      };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error checking request validity:", error);
    throw error;
  }
};

export const createRequest = async (requestData: RequestRow): Promise<any> => {
  try {
    const response = await api.post<any>(`/api/requests/save`, requestData);
    console.log("Use request created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing requestData data:", error);
    throw new Error("Failed to store requestData data");
  }
};
export const updateRequest = async (requestData: RequestRow): Promise<any> => {
  try {
    const response = await api.post<any>(
      `/api/requests/update_request`,
      requestData,
    );
    console.log("Use transfer created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing transferData data:", error);
    throw new Error("Failed to store transferData data");
  }
};
