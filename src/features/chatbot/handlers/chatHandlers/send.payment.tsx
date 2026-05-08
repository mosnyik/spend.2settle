import { phoneNumberPattern } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { useUserStore } from "stores/userStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";

export const handleCryptoPayment = async (chatInput: string) => {
  const { setLoading, addMessages } = useChatStore.getState();
  const { updateUser } = useUserStore.getState();
  const phoneNumber = chatInput.trim();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput !== "0") {
    if (!phoneNumberPattern.test(phoneNumber)) {
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              Please enter a valid phone number, <b>{phoneNumber}</b> is not
              valid.
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      return;
    }

    updateUser({ phone: phoneNumber });
    setLoading(false);

    const newMessages: MessageType[] = [
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
    ];

    addMessages(newMessages);
  }
};
