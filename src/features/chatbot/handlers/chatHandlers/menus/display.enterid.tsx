import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

export const displayEnterId = async (paymentMode: string) => {
    const { next, addMessages } = useChatStore.getState();
    
  const queryId = paymentMode !== "payRequest" ? "Gift ID" : "Request ID";
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter your {queryId}.
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is giftFeedBack");
  // We have to check the request here and fill in the userData
  paymentMode.toLowerCase() === "claim gift"
    ? next({stepId: "enterBankSearchWord"})
    : next({stepId: "transferMoney"});
  addMessages(newMessages);
};
