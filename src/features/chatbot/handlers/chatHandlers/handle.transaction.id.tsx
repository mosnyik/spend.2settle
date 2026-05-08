import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayEnterId } from "./menus/display.enterid";
import { displayMakeChoice } from "./menus/display.make.choice";

export const handleCompleteTransactionId = async (chatInput: string) => {
  const { setPaymentMode } = usePaymentStore.getState();
  const { next, prev } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput.trim() === "0") {
    (() => {
      prev();
      displayMakeChoice();
    })();
  } else if (chatInput === "1") {
    console.log("Let's see what is going on HERE!!!");
    setPaymentMode("Claim Gift");
    const paymentMode = usePaymentStore.getState().paymentMode;

    displayEnterId(paymentMode);
    next({ stepId: "claimGift", transactionType: undefined });
  } else if (chatInput === "2") {
    setPaymentMode("payRequest");
    const paymentMode = usePaymentStore.getState().paymentMode;

    displayEnterId(paymentMode);
    next({ stepId: "payRequest", transactionType: undefined });
  } else if (chatInput === "3") {
    // displayEnterCompleteTransactionId(addChatMessages, nextStep);
  }
};
