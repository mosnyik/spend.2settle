import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WalletState {
  paymentAddress: string;
  ordinalsAddress: string;
  stacksAddress: string;
  isConnected: boolean;
  setWallet: (wallet: Partial<WalletState>) => void;
  disconnect: () => void;
}

export const useBTCWallet = create(
  persist<WalletState>(
    (set) => ({
      paymentAddress: "",
      ordinalsAddress: "",
      stacksAddress: "",
      isConnected: false,
      setWallet: (wallet) =>
        set((state) => ({
          ...state,
          ...wallet,
          isConnected: true,
        })),
      disconnect: () =>
        set(() => ({
          paymentAddress: "",
          ordinalsAddress: "",
          stacksAddress: "",
          isConnected: false,
        })),
    }),
    {
      name: "btc-wallet-storage",
    }
  )
);
