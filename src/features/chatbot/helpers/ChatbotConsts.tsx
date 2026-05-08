import { ConnectButton } from "@rainbow-me/rainbowkit";

import { telegramUser } from "@/types/telegram_types";
import {
  differenceInDays,
  differenceInMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import {
  generateChatId,
  getChatId,
  saveChatId,
} from "../../../utils/utilities";

export const renderDateSeparator = (date: Date) => {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);
  const monthsDiff = differenceInMonths(now, date);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (daysDiff < 7) {
    return format(date, "EEEE");
  } else if (monthsDiff < 6) {
    return format(date, "EEE. d MMM");
  } else {
    return format(date, "d MMM, yyyy");
  }
};

export const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far👋
        <br />
        <br />
        Say 'hi' to chat me up!
      </span>
    ),
    timestamp: new Date(),
    isComponent: false,
  },
];

export const componentMap: { [key: string]: React.ComponentType<any> } = {
  ConnectButton: ConnectButton,
  // Add other components here as needed
};

export const greetings = ["hi", "hello", "hey", "howdy"];


export const initializeChatId = (
  isTelUser: boolean,
  chatId: string,
  telegramUser: telegramUser | null,
  setSharedChatId: (rate: string) => void,
  setChatId: React.Dispatch<React.SetStateAction<string>>
) => {
  // we now set the telegram chatId to the chatId if it a telegram user
  const existingChatId = isTelUser ? telegramUser?.id.toString() : getChatId();
  setSharedChatId(`${existingChatId}`);

  if (!existingChatId) {
    const newChatId = isTelUser
      ? // ? telegramUser?.id ?? generateChatId()
        telegramUser?.id.toString()
      : generateChatId();

    if (newChatId !== undefined) {
      // Ensure newChatId is defined
      saveChatId(newChatId);
      setChatId(newChatId.toString());
    } else {
      console.warn("Failed to generate a new chat ID.");
    }
  } else {
    if (existingChatId !== chatId) {
      setChatId(existingChatId);
    }
  }
};
