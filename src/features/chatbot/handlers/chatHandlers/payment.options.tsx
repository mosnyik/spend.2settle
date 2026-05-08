import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
import { usePaymentStore } from "stores/paymentStore";
import useChatStore, { MessageType } from "stores/chatStore";
import { helloMenu } from "./hello.menu";
import { displayPayIn } from "./menus/display.payment.options";

export const handlePayOptions = async (chatInput: string) => {
  const { crypto, setEstimateAsset } = usePaymentStore.getState();
  const { next, addMessages } = useChatStore.getState();
  const currentStep = useChatStore.getState().currentStep;

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    // go back
  } else if (chatInput === "1") {
    setEstimateAsset("Naira");
    if (await displayPayIn()) next({ stepId: "charge" });
  } else if (chatInput === "2") {
    setEstimateAsset("Dollar");
    if (await displayPayIn()) next({ stepId: "charge" });
  } else if (chatInput === "3") {
    setEstimateAsset(crypto);
    if (await displayPayIn()) next({ stepId: "charge" });
  } else if (currentStep.transactionType?.trim().toLowerCase() === "request") {
    setEstimateAsset("Naira");
    if (await displayPayIn()) next({ stepId: "charge" });
  } else {
    addMessages([
      {
        type: "incoming",
        content: "Invalid choice. Please choose a valid pay option.",
        timestamp: new Date(),
      },
    ]);
  }
};
