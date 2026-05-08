import useChatStore, { MessageType } from "stores/chatStore";

export const displayEnterPhone = (): void => {
  const { addMessages } = useChatStore.getState();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Please enter Phone Number.
          <br />
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is sendPayment");
 
  addMessages(newMessages);
};

