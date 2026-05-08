import { useState } from "react";
import { TRC20_ABI, TRC20_CONTRACT } from "./cryptoConstants";
export interface TronTransactionReceipt {
  result: boolean;
  txid: string;
  transaction?: Record<string, any>;
}
export function useSpendTRC20() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function spendTRC20(
    receiver: string,
    amount: number
  ): Promise<TronTransactionReceipt | null> {
    if (typeof window === "undefined" || !window.tronWeb) {
      throw new Error(
        "TronLink not found. Please install and connect TronLink."
      );
    }

    try {
      setIsLoading(true);
      setError(null);

      const tronWeb = window.tronWeb;
      const sender = tronWeb.defaultAddress.base58;
      if (!sender) throw new Error("No sender address found in TronLink.");

      const contract = await tronWeb.contract(TRC20_ABI, TRC20_CONTRACT);

      // Convert amount to smallest unit (USDT uses 6 decimals)
      const amountInSun = tronWeb.toSun(amount);

      const tx = await contract.transfer(receiver, amountInSun).send({
        from: sender,
      });

      return tx; // transaction hash
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { spendTRC20, isLoading, error };
}
