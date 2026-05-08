import { MessageType } from "@/types/general_types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import parse from "html-react-parser";
import React from "react";
import elementToJSXString from "react-element-to-jsx-string";
import { initialMessages } from "./ChatbotConsts";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  ConnectButton: ConnectButton,
  // Add other components here as needed
};
const MAX_MESSAGES = 100;

const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const serializeMessage = (message: MessageType) => {
  return {
    ...message,
    content: sanitizeSerializedContent(elementToJSXString(message.content)),
  };
};

const deserializeMessage = (message: MessageType): MessageType => {
  return {
    ...message,
    content: parse(message.content as string),
  };
};

export const getLocalStorageData = () => {
  if (typeof window !== "undefined") {
    const fromLocalStorage = window.localStorage.getItem("chat_data");
    if (fromLocalStorage) {
      const parsedData = JSON.parse(fromLocalStorage);
      const deserializedMessages = parsedData.messages.map((msg: any) => ({
        ...deserializeMessage(msg),
        timestamp: new Date(msg.timestamp),
      }));
      const { currentStep, stepHistory = ["start"] } = parsedData;

      const limitedMessages = deserializedMessages.slice(-MAX_MESSAGES);
      const limitedSerializedMessages = parsedData.messages.slice(
        -MAX_MESSAGES
      );
      return {
        messages: limitedMessages,
        serializedMessages: limitedSerializedMessages,
        step: currentStep,
        stepHistory: parsedData.stepHistory || ["start"],
      };
    }
  }

  return {
    messages: initialMessages,
    serializedMessages: initialMessages.map((msg) => ({
      ...serializeMessage(msg),
      timestamp: msg.timestamp.toISOString(),
    })),
    step: "start",
    stepHistory: ["start"],
  };
};

export const saveLocalStorageData = (
  serializedMessages: any[],
  currentStep: string,
  stepHistory: string[]
) => {
  const limitedMessages = serializedMessages.slice(-MAX_MESSAGES);
  const chatData = {
    messages: limitedMessages,
    currentStep,
    stepHistory,
  };
  window.localStorage.setItem("chat_data", JSON.stringify(chatData));
};
