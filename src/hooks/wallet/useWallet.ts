import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useBTCWallet } from "stores/btcWalletStore";
import useTronWallet from "stores/tronWalletStore";
import { useWalletStore } from "./useWalletStore";
import { WalletAddress } from "@/lib/wallets/types";

/**
 * Syncs wallet connection state from all three chains (EVM, BTC, TRON)
 * into the unified useWalletStore.
 *
 * Call once near the top of your app (e.g. layout or _app).
 * Then read from useWalletStore() anywhere else.
 */
export function useWallet() {
  const { isConnected: isEVM, address: evmAddress } = useAccount();
  const { isConnected: isBTC, paymentAddress } = useBTCWallet();
  const { connected: isTron, walletAddress: tronAddress } = useTronWallet();
  const { setWallet, clearWallet, isConnected, address, walletType } =
    useWalletStore();

  useEffect(() => {
    if (isEVM && evmAddress) {
      setWallet("EVM", evmAddress as WalletAddress);
    } else if (isBTC && paymentAddress) {
      setWallet("BTC", paymentAddress as WalletAddress);
    } else if (isTron && tronAddress) {
      setWallet("TRC20", tronAddress as WalletAddress);
    } else {
      clearWallet();
    }
  }, [isEVM, evmAddress, isBTC, paymentAddress, isTron, tronAddress]);

  return { isConnected, address, walletType };
}
