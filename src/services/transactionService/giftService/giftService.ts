import { userData } from "@/types/general_types";
import api from "../../api-client";
import axios from "axios";
import { GiftRow, ReceiverRow } from "../transactionService";

export const isGiftValid = async (
  gift_id: string,
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await api.get("/api/gifts/check_gift", {
      params: { gift_id },
    });

    console.log({ response });

    const payment = response.data?.payment;

    if (response.data?.success && payment && payment.type === "gift") {
      // Map engine payment fields to the userData shape used by handleClaimGift
      return {
        exists: true,
        user: {
          status: payment.status,        // e.g. "confirmed", "settled", "pending"
          gift_status: payment.status,   // reuse status for gift_status checks
          ...payment,
        } as userData,
      };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error checking gift validity:", error);
    throw error;
  }
};

export const updateGiftTransaction = async (
  gift_id: string,
  receiver: ReceiverRow,
) => {
  try {
    const response = await api.post("/api/gifts/update_gift", {
      gift_id,
      receiver: receiver,
      giftUpdates: {
        gift_status: "Claimed",
      },
    });
    // console.log(response.data); // Handle the response
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Server responded with a status other than 2xx
      console.error("Server error:", error.response?.data);
    } else if (error instanceof Error) {
      // Network or other error
      console.error("Network error:", error.message);
    } else {
      // Some other unknown error
      console.error("An unknown error occurred");
    }
  }
};

export const createGift = async (giftData: GiftRow): Promise<any> => {
  try {
    const response = await api.post<any>(`/api/gifts/save`, giftData);
    console.log("Use gift created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing gift data:", error);
    throw new Error("Failed to store gift data");
  }
};

