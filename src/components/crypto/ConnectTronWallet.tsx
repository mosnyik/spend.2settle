"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import ShortenedAddress from "../../helpers/ShortenAddress";
import { MdContentCopy, MdKeyboardArrowDown, MdLogout } from "react-icons/md";
import useTronWallet from "stores/tronWalletStore";
import { useRouter } from "next/navigation";

const ConnectTronWallet = () => {
  // Local state for modal/UI logic
  const [showInitializing, setShowInitializing] = useState(false); // Track initializing state
  const router = useRouter();

  // Zustand store actions/state
  const {
    setWalletAddress,
    setTrxBalance,
    setUSDTBalance,
    setConnected,
    clearWallet,
    connected,
    walletAddress,
    trxBalance,
    usdtBalance,
  } = useTronWallet();

  async function getUSDTBalance() {
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("Tron wallet not connected");
    }

    const tronWeb = window.tronWeb;
    const address = tronWeb.defaultAddress.base58;

    const usdtContractAddress = process.env.NEXT_PUBLIC_USDT_TRC20_CONTRACT;

    if (!usdtContractAddress) {
      throw new Error("USDT contract address is not defined");
    }

    try {
      const contract = await tronWeb.contract().at(usdtContractAddress);
      const balance = await contract.methods.balanceOf(address).call();

      // Safely convert balance to number
      const usdtBalance = parseFloat(balance.toString()) / 1e6;

      console.log(`USDT Balance: ${usdtBalance}`);
      return usdtBalance;
    } catch (err) {
      console.error("Failed to fetch USDT balance", err);
    }
  }

  // Function to fetch balances (TRX + USDT)
  const fetchBalances = async (address: string) => {
    // Fetch TRX balance
    const trxBalance = await window.tronWeb.trx.getBalance(address);
    setTrxBalance(window.tronWeb.fromSun(trxBalance));
    const usdtBalance = await getUSDTBalance();

    setUSDTBalance(usdtBalance ?? 0);
  };

  // Connect wallet logic
  const handleConnectWallet = async () => {
    console.log("Connecting to TronLink...");
    if (!window.tronLink) {
      // TronLink is not installed
      setShowInitializing(true);
      setTimeout(() => {
        window.open("https://www.tronlink.org/", "_blank");
        setShowInitializing(false);
      }, 2000);
      return;
    }
    // Request account access
    try {
      console.log("Requesting TronLink accounts...");
      // Try to request accounts (will trigger popup if locked)
      await window.tronLink.request({ method: "tron_requestAccounts" });
      // After user logs in/unlocks, get address
      const userAddress = window.tronWeb.defaultAddress.base58;
      setWalletAddress(userAddress);
      const walletBal = await fetchBalances(userAddress); // Fetch and save balances
      setConnected(true);
      console.log("Wallet balance", walletBal);
    } catch (err) {
      // User rejected or not logged in, try to prompt login
      setShowInitializing(true);
      setTimeout(() => {
        setShowInitializing(false);
      }, 2000);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    clearWallet();
    router.refresh();
  };

  const handleCopy = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      alert("Copied");
    }
  };

  // On mount, check connection or try auto-connect
  useEffect(() => {
    if (window.tronWeb && window.tronWeb.ready) {
      const address = window.tronWeb.defaultAddress.base58;
      setWalletAddress(address);
      fetchBalances(address);
      setConnected(true);
    }
  }, []);

  return (
    <div className="relative">
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center bg-white px-6 py-1 rounded-xl text-base font-bold border-gray-100 border-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/12114/12114250.png"
              alt="tron"
              className="h-5 w-5 mr-4"
            />
            TRC20
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-gray-100 px-4 py-1 rounded-xl text-base font-bold border-white border-2">
                <div className="flex items-center gap-1">
                  <ShortenedAddress wallet={walletAddress} />
                  <MdKeyboardArrowDown />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center text-xl font-bold">
                    Tron Wallet
                  </div>
                </DialogTitle>

                <DialogDescription>
                  <div className="text-center mb-4">
                    <div className="text-sm mt-1 font-bold text-black">
                      <ShortenedAddress wallet={walletAddress} />
                      <ul>
                        <li>
                          <p>TRX Balance: {trxBalance.toString()}</p>
                        </li>
                        <li>
                          <p>USDT Balance: {usdtBalance}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-around mt-6">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <MdContentCopy />
                      Copy
                    </button>
                    <button
                      onClick={disconnect}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <MdLogout />
                      Disconnect
                    </button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="bg-transparent text-white"
        >
          Connect Tron Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectTronWallet;
