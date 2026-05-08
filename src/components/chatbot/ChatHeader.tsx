import React from "react";
import Image from "next/image";
import { useOnlineStatus } from "./useOnlineStatus";
interface Props {
  onClose: () => void;
  showDateDropdown: boolean;
  currentDate: string | null;
  // isOnline: boolean;
}

const ChatHeader = ({ onClose, showDateDropdown, currentDate }: Props) => {
  const isOnline = useOnlineStatus();
  return (
    <header className="py-4 text-center text-white bg-blue-500 shadow relative z-10">
      <div className="flex items-center justify-between px-4">
        <span className="flex-shrink-0 w-8 h-8 bg-white rounded">
          {isOnline ? (
            <Image
              src="/wale/waaa.png"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded"
            />
          ) : (
            <span
              className="text-md font-semibold text-red-600"
              title="You are offline"
            >
              ⚠️
            </span>
          )}
        </span>
        <h2 className="text-lg font-bold">2SettleHQ</h2>
        <button
          onClick={onClose}
          className="text-white"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {showDateDropdown && currentDate && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-700 px-4 py-2 rounded-b-lg shadow-md text-sm transition-all duration-300 ease-in-out">
          {currentDate}
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
