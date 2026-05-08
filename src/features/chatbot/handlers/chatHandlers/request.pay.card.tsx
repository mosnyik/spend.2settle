import useChatStore from "stores/chatStore";

export const requestPayCard = async (chatInput?: string) => {
  console.log("we are at the start of the program");

  const telFirstName = "Mosnyik";

  const { addMessages } = useChatStore.getState();
  addMessages?.([
    {
      type: "incoming",
      content: <span>You want a payCard right?</span>,
      timestamp: new Date(),
    },
  ]);
  // sendChatInput(chatInput!);
};
