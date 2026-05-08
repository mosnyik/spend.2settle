import { isRequestValid } from "@/services/transactionService/requestService/requestService";
import useChatStore from "stores/chatStore";
import { useTransactionStore } from "stores/transactionStore";
import { usePaymentStore } from "stores/paymentStore";
import { displayTransferMoney } from "./menus/transfer.money";

export const handlePayRequest = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const requestId = chatInput.trim();

  const result = await isRequestValid(requestId);

  if (!result.exists || !result.user) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            I can not find this request,
            <br />
            Please check the requestId
            <br />
            and be sure you are entering it correctly,
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const { request_status } = result.user;
  const normalizedStatus = request_status?.toLowerCase();

  if (normalizedStatus === "created") {
    // Request exists and hasn't been fulfilled yet — proceed to crypto selection
    useTransactionStore.getState().setRequestId(requestId);
    usePaymentStore.getState().setPaymentMode("payrequest");
    displayTransferMoney();
    next({ stepId: "transactCrypto", transactionType: "payrequest" });
    return;
  }

  if (normalizedStatus === "settled") {
    addMessages([
      {
        type: "incoming",
        content: "This request has already been fulfilled.",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  if (normalizedStatus === "pending" || normalizedStatus === "confirming" || normalizedStatus === "confirmed") {
    addMessages([
      {
        type: "incoming",
        content: "This request is currently being processed by another payer.",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  if (normalizedStatus === "expired") {
    addMessages([
      {
        type: "incoming",
        content: "This request has expired.",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  addMessages([
    {
      type: "incoming",
      content: "This request cannot be fulfilled because it is no longer active.",
      timestamp: new Date(),
    },
  ]);
};
