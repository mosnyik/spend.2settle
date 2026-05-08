import { useState } from "react";

export function useSpendTRX() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function spendTRX(receiver: string, amountInTRX: number) {
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

      // Convert TRX to SUN (1 TRX = 1e6 SUN)
      //   const amountInSun = tronWeb.toSun(amountInTRX).toString();
      const amountInSun = Number(tronWeb.toSun(amountInTRX));

      const tx = await tronWeb.transactionBuilder.sendTrx(
        receiver,
        amountInSun,
        sender
      );
      const signedTx = await tronWeb.trx.sign(tx);
      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      return receipt; // includes transaction ID and status
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { spendTRX, isLoading, error };
}
