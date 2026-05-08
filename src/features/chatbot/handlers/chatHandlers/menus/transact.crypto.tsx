import useChatStore, { MessageType } from "stores/chatStore";

// choose what you want to do in transact crypto
export const displayTransactCrypto = () => {
  const { addMessages } = useChatStore.getState();

  {
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            1. Transfer money
            <br />
            2. Send Gift
            <br />
            3. Request for payment
            <br />
            0. Go back
          </span>
        ),
        timestamp: new Date(),
      },
    ];
    console.log("Next is howToEstimate");

    addMessages(newMessages);
  }
};


