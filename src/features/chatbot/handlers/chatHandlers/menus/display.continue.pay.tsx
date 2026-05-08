import { useBankStore } from "stores/bankStore";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

export const displayContinueToPay = () => {
  const currentStep = useChatStore.getState().currentStep;
  const { addMessages } = useChatStore.getState();
  const bankData = useBankStore.getState().bankData;
  const { paymentMode } = usePaymentStore.getState();

  console.log("Bank details", bankData);
  const { acct_number, bank_name, receiver_name } = bankData;

  const name = receiver_name;
  const bankName = bank_name;
  const accountNumber = acct_number;

  //   bank.8063862295

  let isGift = paymentMode.toLowerCase() !== "gift";

  const newMessages: MessageType[] = [];

  if (isGift) {
    newMessages.push({
      type: "incoming",
      content: (
        <span>
          Name: {name}
          <br />
          Bank name: {bankName}
          <br />
          Account number: {accountNumber}
        </span>
      ),
      timestamp: new Date(),
    });
  }

  newMessages.push({
    type: "incoming",
    content: (
      <span>
        Here is your menu:
        <br />
        <br />
        1. Continue
        <br />
        0. Go back
        <br />
        00. Exit
      </span>
    ),
    timestamp: new Date(),
  });

  console.log("Next is enterPhone");
  addMessages(newMessages);
};
