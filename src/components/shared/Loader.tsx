import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center space-x-1">
      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-400"></div>
    </div>
  );
};

export default Loader;
