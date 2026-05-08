import useChatStore, { MessageType } from "stores/chatStore";

export const displayKYCInfo = async () => {
  const { addMessages } = useChatStore.getState();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          You will be directed to a KYC link, this details are required:
          <br />
          <br />
          Bank details
          <br />
          Phone Number
          <br />
          Address
        </span>
      ),
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          1. Continue
          <br />
          2. Cancel
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is thankForKYCReg");
  addMessages(newMessages);
};
