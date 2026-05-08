import { getBaseSymbol } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

// choose the asset you want to use in the transaction

interface estimateType {
  crypto: string;
  ticker: string;
}
export const displayHowToEstimation = async ({
  crypto,
  ticker,
}: estimateType) => {
  const { addMessages } = useChatStore.getState();
  const asset = getBaseSymbol(ticker)

  const ethChainId = 1;
  const bnbChainId = 56;
  const bnbTestChainId = 97;
  const sopeliaChainId = 11155111;

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: `How would you like to estimate your ${crypto} (${asset.toUpperCase()})?`,
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          <br />
          1. Naira
          <br />
          2. Dollar
          <br />
          3. Crypto
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is estimationAmount");
  addMessages(newMessages);
};
