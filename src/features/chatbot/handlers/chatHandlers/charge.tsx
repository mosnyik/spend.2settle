import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayCharge } from "./menus/display.charge";

export const handleCharge = async (chatInput: string) => {
  const { addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    // go back
  } else if (chatInput !== "0") {
    await displayCharge(chatInput);
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Do you want to include charge in your estimate or not?.",
        timestamp: new Date(),
      },
    ]);
  }
};
