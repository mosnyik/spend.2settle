import { getAvaialableWallet } from "@/helpers/api_calls";
import type React from "react";

export const handleConfirm = async ({
  setState,
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
}: {
  setState: React.Dispatch<
    React.SetStateAction<{
      isButtonClicked: boolean;
      isProcessing: boolean;
      error: string | null;
      activeWallet: string | null;
      lastAssignedTime: Date | null;
      isExpired: boolean;
      isDialogOpen: boolean;
      isCopied: boolean;
      hasCopyButtonBeenClicked: boolean;
      transactionInProgress?: boolean; // Add this optional field
    }>
  >;
  phoneNumber: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isRetry: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet: string,
    assignedTime?: Date
  ) => Promise<void>;
  network: string;
}) => {
  // First check if we're already processing to prevent multiple calls
  let shouldProceed = false;

  setState((prev) => {
    if (prev.isProcessing || prev.transactionInProgress) {
      console.log("Transaction already in progress, ignoring request");
      return prev;
    }

    shouldProceed = true;
    return {
      ...prev,
      isDialogOpen: false,
      isButtonClicked: true,
      isProcessing: true,
      transactionInProgress: true,
      error: null,
    };
  });

  // If we shouldn't proceed, exit early
  if (!shouldProceed) {
    console.log(
      "Exiting handleConfirm early - transaction already in progress"
    );
    return;
  }

  try {
    console.log("Starting transaction process");
    const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
      network
    );
    const assignedTime = new Date(lastAssignedTime);

    setState((prev) => ({
      ...prev,
      activeWallet,
      lastAssignedTime: assignedTime,
    }));

    const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
    const requestPayment =
      sharedPaymentMode.toLowerCase() === "request" ||
      sharedPaymentMode.toLowerCase() === "payrequest";

    setLoading(true);
    console.log("Calling processTransaction with:", {
      phoneNumber,
      isGiftTrx,
      requestPayment,
      activeWallet,
      assignedTime,
    });

    await processTransaction(
      phoneNumber,
      false,
      isGiftTrx,
      requestPayment,
      activeWallet,
      assignedTime
    );

    console.log(`Transaction processed for phone number: ${phoneNumber}`);
  } catch (error) {
    console.error("Error processing transaction:", error);
    setState((prev) => ({
      ...prev,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      isButtonClicked: false,
      isProcessing: false,
      transactionInProgress: false,
    }));
  } finally {
    setState((prev) => ({
      ...prev,
      isProcessing: false,
      // Note: We're not resetting transactionInProgress here to prevent multiple dialogs
      // It will be reset when the component unmounts or when a new transaction starts
    }));
    setLoading(false);
  }
};
