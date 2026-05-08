"use client";

import { useEffect } from "react";
import { useUserStore } from "stores/userStore";
import { detectTelegramUser } from "./detectTelegramUser";
import { generateChatId } from "@/utils/utilities";

export default function UserBootstrap() {
  const { user, setUser } = useUserStore.getState();

  useEffect(() => {
    const telegramUser = detectTelegramUser();

    if (telegramUser) {
      setUser({
        chatId: String(telegramUser.id),
        telegram: telegramUser,
      });
    } else {
      if (user?.chatId) {
      } else {
        setUser({
          chatId: generateChatId().toString(),
        });
      }
    }
  }, [setUser]);

  return null;
}
