// src/stores/tronWalletStore.ts
import { BigNumber } from "tronweb";
import { create } from "zustand"; 
import { persist } from "zustand/middleware";

// Define the interface for the wallet store state and actions
interface TronWalletState {
  connected: boolean; // Whether wallet is connected
  walletAddress: string | undefined; // Wallet address (null if not connected)
  trxBalance: string | BigNumber; // TRX balance (0 when not connected)
  usdtBalance: number; // USDT balance (0 when not connected)
  setConnected: (connected: boolean) => void; // Set connection state
  setWalletAddress: (address: string | undefined) => void; // Set wallet address
  setTrxBalance: (balance: string | BigNumber) => void; // Set TRX balance
  setUSDTBalance: (balance: number) => void; // Set USDT balance
  clearWallet: () => void; // Clear all wallet data (disconnect)
}

// Create the zustand store
const useTronWallet = create(
  persist<TronWalletState>(
    (set) => ({
      connected: false, // Default: not connected
      walletAddress: undefined, // Default: no address
      trxBalance: 0 || "0", // Default:0 TRX
      usdtBalance: 0, // Default:0 USDT

      setConnected: (connected) => set({ connected }), // Update connection state

      setWalletAddress: (walletAddress) => set({ walletAddress }), // Update wallet address

      setTrxBalance: (trxBalance) => set({ trxBalance }), // Update TRX balance

      setUSDTBalance: (usdtBalance) => set({ usdtBalance }), // Update USDT balance

      clearWallet: () => {
        set({
          connected: false, // Reset connection
          walletAddress: undefined, // Clear address
          trxBalance: 0 || "0", // Reset TRX
          usdtBalance: 0, // Reset USDT
        });
        localStorage.removeItem("tron-wallet-storage");
      }, // Clear all wallet fields
    }),
    { name: "tron-wallet-storage" }
  )
);
export default useTronWallet; // Export the store for use in components
