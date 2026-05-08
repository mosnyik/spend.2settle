import { geminiAi } from "@/services/ai/ai-services";
import useChatStore from "stores/chatStore";

export const handleAiChat = async (chatInput?: string) => {
  const { addMessages } = useChatStore.getState();
  try {
    console.log("we are at the start");

    // window.localStorage.setItem("transactionID", "");

    const messages: any = [];
    const updatedMessages = [...messages, { role: "user", content: chatInput }];
    let sessionId = window.localStorage.getItem("transactionID");

    // ✅ If it doesn't exist, create and store it
    if (!sessionId) {
      sessionId = Math.floor(100000 + Math.random() * 900000).toString();
      window.localStorage.setItem("transactionID", sessionId);
      console.log("Generated new sessionId:", sessionId);
    } else {
      console.log("Using existing sessionId:", sessionId);
    }
    console.log("Generated new sessionId:", chatInput);
    // const reply = await OpenAI(updatedMessages, sessionId);
    const reply = await geminiAi(chatInput, sessionId);
    console.log("this is the response from backend", reply.reply);

    addMessages?.([
      {
        type: "incoming",
        content: <span>{reply.reply}</span>, // simplified: just the assistant's latest reply
        timestamp: new Date(),
      },
    ]);
  } catch (err) {
    console.error("There was an error from backend", err);
    addMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            😓 Sorry, something went wrong while processing your request.
            <br />
            Please try again in a moment.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
