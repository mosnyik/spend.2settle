import { MessageType } from "./general_types";

export interface SerializedMessageType {
  type: string;
  content: string;
}

export interface ChatNavigationHook {
  chatMessages: MessageType[];
  serializedMessages: SerializedMessageType[];
  currentStep: string;
  stepHistory: string[];
  addChatMessages: (messages: MessageType[]) => void;
  nextStep: (nextStep: string) => void;
  prevStep: () => void;
  goToStep: (step: string) => void;
}
