import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Button } from "../../ui/button";
import { telegramUser } from "@/types/telegram_types";
import useErrorHandler from "@/hooks/chatbot/useErrorHandler";

export default function TelegramIntegration() {
  const { error, handleError, clearError } = useErrorHandler();
  const [telegramUser, setTelegramUser] = useState<telegramUser | null>(null);
  const [isTelUser, setIsTelUser] = useState(false);

  useEffect(() => {
    const loadTelegramWebApp = async () => {
      if (typeof window !== "undefined") {
        try {
          const twa = await import("@twa-dev/sdk");
          if (twa.default.initDataUnsafe.user) {
            console.log("From the telegram component, we load telegram...");
            setTelegramUser(twa.default.initDataUnsafe.user as telegramUser);
            setIsTelUser(true);
          }
        } catch (error) {
          handleError("Failed to load Telegram Web App SDK");
        }
      }
    };

    loadTelegramWebApp();
  }, [handleError]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message}
          <Button onClick={clearError} variant="outline" className="mt-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
}
