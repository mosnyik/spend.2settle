"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Address, TransactionReceipt } from "viem";
import {
  BEP20_ABI,
  BEP20_CONTRACT,
  ERC20_ABI,
  ERC20_CONTRACT,
} from "@/services/transactionService/cryptoService/cryptoConstants";
import { config } from "../../../wagmi";
import { useEnsureNetwork } from "./useEnsureNetwork";
import { CHAINS } from "./chainConfig";
import { networkType } from "./types";

export function useSpendEVMUSDT() {
  const { address: caller } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { ensureNetwork } = useEnsureNetwork();
  const [error, setError] = useState<Error | null>(null);

  const spendEVMUSDT = async (
    receiver: Address,
    amount: bigint,
    isERC20 = false
  ): Promise<TransactionReceipt | null> => {
    if (!caller) {
      setError(new Error("Wallet not connected"));
      return null;
    }

    let network: networkType = isERC20 ? "eth" : "bnb";

    try {
      const chain = CHAINS[network];
      await ensureNetwork(chain.network);
      // Send the transaction (returns tx hash)
      const hash = await writeContractAsync({
        address: isERC20 ? ERC20_CONTRACT : BEP20_CONTRACT,
        abi: isERC20 ? ERC20_ABI : BEP20_ABI,
        functionName: "transfer",
        args: [receiver, amount],
      });

      // Wait for transaction to be mined
      const { waitForTransactionReceipt } = await import("wagmi/actions");
      const receipt = await waitForTransactionReceipt(config, { hash });

      return receipt;
    } catch (err: any) {
      console.error("Error during EVM USDT transfer:", err);
      setError(err);
      return null;
    }
  };

  return { spendEVMUSDT, error };
}
