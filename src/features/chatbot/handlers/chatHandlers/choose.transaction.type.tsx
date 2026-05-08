import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayTransferMoney } from "./menus/transfer.money";
import { usePaymentStore } from "stores/paymentStore";

// select how you want to transactCrypto (transferMoney, sendGift, requestpyment)
export const handleChooseTransactionType = (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const { setEstimateAsset } = usePaymentStore.getState();
  const setPaymentMode = usePaymentStore.getState().setPaymentMode;

  console.log("Chatinput from make choice", chatInput);
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    console.log("The choice is ONE, handleChooseTransactionType");
    displayTransferMoney();
    setPaymentMode("");
    next({
      stepId: "transactCrypto",
      transactionType: "transfer",
    });
  } else if (chatInput === "2") {
    console.log("The choice is TWO, REQUEST PAY CARD");
    displayTransferMoney();
    setPaymentMode("");
    next({
      stepId: "transactCrypto",
      transactionType: "gift",
    });
  } else if (chatInput === "3") {
    setEstimateAsset("Naira");
    setPaymentMode("");
    next({
      stepId: "charge",
      transactionType: "request",
    });
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Enter the amount you want to request in Naira
            <br />
            <br />
            0. Go back
            <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. You need to choose an action from the options",
        timestamp: new Date(),
      },
    ]);
  }
};
