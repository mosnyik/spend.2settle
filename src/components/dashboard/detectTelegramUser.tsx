import { telegramUser } from "@/types/telegram_types";

export function detectTelegramUser(): telegramUser | null {
  if (typeof window === "undefined") return null;

  const tg = (window as any).Telegram?.WebApp;

  if (!tg || !tg.initDataUnsafe?.user) {
    return null;
  }

  const user = tg.initDataUnsafe.user;

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
  };
}
