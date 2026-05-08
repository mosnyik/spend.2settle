export interface ChatBotProps {
  isMobile: boolean;
  onClose: () => void;
  onError?: (error: Error) => void;
} 

