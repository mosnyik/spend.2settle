import { useState } from "react";
import { useChatNavigation } from "./useChatNavigation";

// useChatState.ts
export const useChatState = () => {
  const [chatInput, setChatInput] = useState("");
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const { messages, chatMessages, addChatMessages } = useChatNavigation();

  return {
    chatInput,
    setChatInput,
    messages, 
    chatMessages,
    addChatMessages,
    currentDate,
    setCurrentDate,
  };
};
