import { useMemo } from "react";
import { format } from "date-fns";
import { MessageType } from "stores/chatStore";

export function useGroupedMessages(chatMessages: MessageType[]) {
  return useMemo(() => {
    return chatMessages.reduce((groups, message) => {
      const dateKey = format(new Date(message.timestamp), "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);
      return groups;
    }, {} as Record<string, MessageType[]>);
  }, [chatMessages]);
}
