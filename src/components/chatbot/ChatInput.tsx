import React from "react";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  chatInput: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: (
    chatInput: string,
    onError?: ((error: Error) => void) | undefined
  ) => void;
}

const ChatInput = ({ textareaRef, chatInput, onChange, onSubmit }: Props) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      onSubmit(chatInput);
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center">
        <textarea
          ref={textareaRef}
          value={chatInput}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
          placeholder="Enter a message..."
          rows={1}
          spellCheck={false}
          required
        />
        <button
          onClick={() => onSubmit(chatInput)}
          className="ml-2 text-blue-500 cursor-pointer"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};
export default ChatInput;

// interface Props {
//   textareaRef: React.RefObject<HTMLTextAreaElement>;
//   onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
//   handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
//   handleConversation: (chatInput: string) => Promise<void>;
//   chatInput: string;
// }

// const ChatInput = ({
//   textareaRef,
//   chatInput,
//   onChange,
//   handleKeyPress,
//   handleConversation,
// }: Props) => {
//   return (
//     <div className="p-3 border-t border-gray-200 bg-white">
//       <div className="flex items-center">
//         <textarea
// ref={textareaRef}
// className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
// placeholder="Enter a message..."
// rows={1}
// spellCheck={false}
// required
// value={chatInput}
// onChange={onChange}
// onKeyDown={handleKeyPress}
//         />
// <button
//   className="ml-2 text-blue-500 cursor-pointer"
//   onClick={() => handleConversation(chatInput)}
//   aria-label="Send message"
// >
//           <SendIcon />
//         </button>
//       </div>
//     </div>
//   );
// };
