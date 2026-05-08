import useChatStore, { MessageType } from "stores/chatStore";

// GIFT FEEDBACK MESSAGE
export const displayGiftFeedbackMessage = () => {
    const { addMessages } = useChatStore.getState();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Your gift claim confirm is Successful!
          <br />
          Wait while we process your transaction...
        </span>
      ),
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          You would recieve your credit in at most the next 15 mins,
          <br />
          If not contact support in '3. Customer support' above
          <br />
          <b>
            Please make sure you check your balance before contacting support,
            thank you
          </b>
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is start");
  addMessages(newMessages);
};
