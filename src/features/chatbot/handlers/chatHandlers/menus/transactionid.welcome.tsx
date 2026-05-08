import useChatStore, { MessageType } from "stores/chatStore";

export const displayTransactIDWelcome = () => {
  const { addMessages } = useChatStore.getState();
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          1. Claim Gift
          <br />
          2. Fulfill Request
          <br />
          3. Complete your transaction
          <br />
          0. Go back
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is thankForKYCReg");

  addMessages(newMessages);
};
