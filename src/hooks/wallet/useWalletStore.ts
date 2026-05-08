import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletType, WalletAddress } from "@/lib/wallets/types";

interface WalletConnectionState {
  walletType: WalletType | null;
  address: WalletAddress;
  isConnected: boolean;
  setWalletType: (type: WalletType) => void;
  clearWalletType: () => void;
  setWallet: (type: WalletType, address: WalletAddress) => void;
  clearWallet: () => void;
}

export const useWalletStore = create(
  persist<WalletConnectionState>(
    (set) => ({
      walletType: null,
      address: undefined,
      isConnected: false,
      setWalletType: (type) => set({ walletType: type }),
      clearWalletType: () => set({ walletType: null }),
      setWallet: (walletType, address) =>
        set({ walletType, address, isConnected: true }),
      clearWallet: () =>
        set({ walletType: null, address: undefined, isConnected: false }),
    }),
    {
      name: "connected-wallet-type",
    }
  )
);
