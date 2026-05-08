
import useChatStore from "stores/chatStore";

export function useChatNavigation() {
  const {
    messages,
    serialized,
    currentStep,
    stepHistory,
    getDeserializedMessages,
    addMessages,
    next,
    prev,
  } = useChatStore();

    const chatMessages = getDeserializedMessages().map((msg) => ({
      ...msg,
      timestamp: msg.timestamp || new Date(),
      type: msg.type as "incoming" | "outgoing",
    }));

  return {
    messages,
    chatMessages,
    serializedMessages: serialized,
    currentStep,
    stepHistory,
    addChatMessages: addMessages,
    nextStep: next,
    prevStep: prev,
  };
}
