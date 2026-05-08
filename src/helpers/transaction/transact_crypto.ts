import { WalletAddress, WalletType } from "@/lib/wallets/types";

export const getWalletType = (wallet: WalletAddress | null): WalletType => {
  if (!wallet) return "UNKNOWN";
  if (wallet.startsWith("0x")) return "EVM";
  if (
    wallet.startsWith("1") ||
    wallet.startsWith("3") ||
    wallet.startsWith("bc1")
  )
    return "BTC";

  if (
    (wallet.startsWith("T") && wallet.length === 34) ||
    (wallet.startsWith("41") && wallet.length === 42) ||
    (wallet.startsWith("0x41") && wallet.length === 44)
  )
    return "TRX";
  return "UNKNOWN";
};
