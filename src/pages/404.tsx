import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          router.push("/");
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRefresh = () => {
    router.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setSearchTerm("");
    }, 2000);
  };
  useEffect(() => {
    // Basic mobile device detection using user agent
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      // || window.opera;
      if (/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIfMobile();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("09038880228");
    alert("Phone number copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="mb-8">
          <ErrorOutlineIcon className="text-blue-500 text-8xl mb-4 animate-bounce" />
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
            404
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Oops! Page not found
          </p>
        </div>
        <p className="text-gray-500 mb-8">
          Is like the page you are looking for has gone to get some bean and
          bole. Let's try to find it together!
        </p>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for the lost page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600"
            >
              <SearchIcon />
            </button>
          </div>
        </form>
        {isSearching && (
          <p className="text-blue-500 mb-4 animate-pulse">
            Searching for your page...
          </p>
        )}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            <HomeIcon className="mr-2" />
            Go Home
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors transform hover:scale-105"
          >
            <RefreshIcon className="mr-2" />
            Refresh Page
          </button>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          Don't worry, we'll take you home in{" "}
          <span className="font-bold text-blue-500">{countdown}</span>{" "}
          seconds...
        </p>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600">Be like you don miss road? 😉</p>
        <p className="text-gray-600">Our support team is here to help!</p>
        {/* <a
          href="mailto:support@cryptocomfort.com"
          className="text-blue-500 hover:underline"
        >
          09038880228
        </a> */}
        {isMobile ? (
          <a
            href="tel:+2349038880228"
            className="text-blue-500 hover:underline"
          >
            +2349038880228
          </a>
        ) : (
          <span
            onClick={copyToClipboard}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            +2349038880228 (Click to Copy)
          </span>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;
