import useChatStore, { MessageType } from "stores/chatStore";

export const displayTransferMoney = () => {
  const { addMessages } = useChatStore.getState();
  console.log("Let's start with selecting an actions");
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Pay with:
          <br />
          <br />
          1. Bitcoin (BTC)
          <br />
          2. Ethereum (ETH)
          <br />
          3. BINANCE (BNB)
          <br />
          4. TRON (TRX)
          <br />
          5. USDT
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is howToEstimate");

  addMessages(newMessages);
};
