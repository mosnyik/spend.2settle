"use client";

import { useWallet } from "@/hooks/wallet/useWallet";

// Invisible component that syncs wallet connection state from all chains
// (EVM, BTC, TRON) into the unified useWalletStore.
export function WalletBootstrap() {
  useWallet();
  return null;
}
