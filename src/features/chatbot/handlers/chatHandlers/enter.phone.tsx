import { processTransaction } from "@/core/process_transaction/process_transction_helpers";
import { phoneNumberPattern } from "@/utils/utilities";
import useChatStore from "stores/chatStore";
import { useUserStore } from "stores/userStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displaySearchBank } from "./menus/display.bank.search";
import { displayEnterPhone } from "./menus/display.phone";

export const handlePhoneNumber = async (chatInput: string) => {
  const { prev, next, addMessages, setLoading, currentStep } = useChatStore.getState();
  const { updateUser } = useUserStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    prev();
    displaySearchBank();
  } else if (chatInput.trim() === "1") {
    // Transfer flow: user confirmed bank details, now ask for phone
    displayEnterPhone();
    next({ stepId: "enterPhone", transactionType: currentStep.transactionType }); // carry transactionType so processTransaction knows transfer/gift/request
  } else if (phoneNumberPattern.test(chatInput.trim())) {
    updateUser({ phone: chatInput.trim() });

    if (currentStep.transactionType?.toLowerCase() === "request") {
      // Request flow: create request directly, no payment confirmation needed
      setLoading(true);
      try {
        await processTransaction();
      } finally {
        setLoading(false);
      }
    } else {
      // Transfer / gift flow: show ConfirmAndProceedButton
      next({ stepId: "sendPayment", transactionType: currentStep.transactionType });
      addMessages([
        {
          type: "incoming",
          content: (
            <div className="flex flex-col items-center">
              <p className="mb-4">
                Do you understand that you need to complete your payment within{" "}
                <b>30 minutes</b>, otherwise you may lose your money.
              </p>
            </div>
          ),
          intent: {
            kind: "component",
            name: "ConfirmAndProceedButton",
            persist: true,
          },
          timestamp: new Date(),
        },
      ]);
    }
  } else {
    addMessages([
      {
        type: "incoming",
        content: <span>Please enter a valid phone number.</span>,
        timestamp: new Date(),
      },
    ]);
  }
};
