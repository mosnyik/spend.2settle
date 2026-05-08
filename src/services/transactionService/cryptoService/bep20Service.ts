"use client";
import { EthereumAddress } from "@/types/general_types";
import { TransactionReceipt, Web3 } from "web3";
import { BEP20_ABI, BEP20_CONTRACT } from "./cryptoConstants";

export async function spendBEP20(
  caller: EthereumAddress,
  recieverWallet: EthereumAddress,
  amount: bigint
): Promise<TransactionReceipt | null> {
  let reciept: TransactionReceipt | null = null;
  try {
    if (
      typeof window === "undefined" ||
      typeof window?.ethereum === "undefined"
    ) {
      console.error("Metamsk not installed, Install metamsk to continue");
      throw new Error(
        "You need a provider like MetaMask to complete your transaction"
      );
    }

    const web3 = new Web3(window.ethereum);

    const usdt = new web3.eth.Contract(BEP20_ABI, BEP20_CONTRACT);
    console.log("we have rwache the end of the trx");
    reciept = await usdt.methods
      .transfer(recieverWallet, amount)
      .send({ from: caller });

    console.log("receipt", reciept);
  } catch (error) {
    console.error("Error requesting accounts:", error);
  }
  return reciept;
}
