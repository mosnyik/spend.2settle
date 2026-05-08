import React from "react";

interface TruncatedTextProps {
  text: string;
  maxLength: number;
}

const TruncatedText = ({ text, maxLength }: TruncatedTextProps): string => {
  const truncatedText =
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return truncatedText;
};

export default TruncatedText;
