import useChatStore, { MessageType } from "stores/chatStore";

export const displayCustomerSupportWelcome = async () => {
     const { addMessages } = useChatStore.getState();
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          <br />
          1. Make Enquiry
          <br />
          2. Make Complain
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
