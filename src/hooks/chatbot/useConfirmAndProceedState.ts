import { getDirectDebitWallet } from "@/helpers/api_calls";
import { sendBTC, spendTRX } from "@/helpers/ethereum_script/spend_crypto";
import { WalletAddress } from "@/lib/wallets/types";
import { networkType } from "@/services/transactionService/cryptoService/types";
import { useSpendNative } from "@/services/transactionService/cryptoService/useSpendBepToken";
import { useSpendEVMUSDT } from "@/services/transactionService/cryptoService/useSpendEVMUSDT";
import { useSpendTRC20 } from "@/services/transactionService/cryptoService/useSpendTRC20";
import { EthereumAddress } from "@/types/general_types";
import { parseUnits } from "ethers/utils";

/**
 * Truncate decimal places to avoid parseUnits underflow errors
 * USDT decimals: ERC20 = 6, TRC20 = 6, BEP20 = 18
 */
function truncateDecimals(value: string, decimals: number): string {
  const [intPart, decPart = ""] = value.split(".");
  if (!decPart) return value;
  return `${intPart}.${decPart.slice(0, decimals)}`;
}
import { request, RpcErrorCode } from "sats-connect";
import { TransactionReceipt } from "viem";
import { useBTCWallet } from "stores/btcWalletStore";
import { usePaymentStore } from "stores/paymentStore";
import useChatStore from "stores/chatStore";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";
import { processTransaction } from "@/core/process_transaction/process_transction_helpers";
import { useConfirmDialogStore } from "stores/useConfirmDialogStore";

/**
 * Check if user's wallet is connected for the current network
 */
export function isWalletConnectedForNetwork(): boolean {
  const { isConnected, walletType } = useWalletStore.getState();
  const { network } = usePaymentStore.getState();

  if (!isConnected || !network) return false;

  const networkLower = network.toLowerCase();

  // EVM networks require EVM wallet
  if (["eth", "bnb", "erc20", "bep20"].includes(networkLower)) {
    return walletType === "EVM";
  }

  // TRON networks require TRON wallet
  if (["trx", "trc20"].includes(networkLower)) {
    return walletType === "TRC20";
  }

  // BTC requires BTC wallet
  if (networkLower === "btc") {
    return walletType === "BTC";
  }

  return false;
}

/**
 * Hook for executing blockchain payments by directly debiting user's connected wallet.
 * Must be used inside a React component because it uses wagmi hooks.
 */
export function useBlockchainPayment() {
  const { network, paymentAssetEstimate } = usePaymentStore();
  const { setLoading } = useChatStore();
  const { setWalletFetchError } = useConfirmDialogStore();
  const { paymentAddress: btcPaymentAddress } = useBTCWallet();
  const { isConnected, walletType } = useWalletStore();

  // These are React hooks - they must be called at the top level of this hook
  const { spendNative } = useSpendNative();
  const { spendEVMUSDT } = useSpendEVMUSDT();
  const { spendTRC20 } = useSpendTRC20();

  const amount = paymentAssetEstimate;

  const executePayment = async (): Promise<{ success: boolean; error?: string }> => {
    if (!network) {
      return { success: false, error: "Network is not set" };
    }

    if (!amount) {
      return { success: false, error: "Payment amount is not set" };
    }

    if (!isConnected) {
      return { success: false, error: "Wallet is not connected" };
    }

    console.log("executePayment called with network:", network, "amount:", amount);

    try {
      setLoading(true);

      // Get direct debit wallet address (where to send funds)
      const receiverWallet = await getDirectDebitWallet(network.toLowerCase());

      if (!receiverWallet) {
        return { success: false, error: "Failed to get receiver wallet address" };
      }

      let receipt: TransactionReceipt | null = null;
      let btcSent = false;
      let trxSent = false;

      console.log("Receiver wallet:", receiverWallet, "network:", network);

      switch (network.toLowerCase()) {
        case "eth":
          console.log("Processing ETH transaction:", amount);
          receipt = await spendNative(
            receiverWallet as `0x${string}`,
            amount,
            "eth" as networkType
          );
          console.log("ETH transaction result:", receipt);
          break;

        case "bnb":
          console.log("Processing BNB transaction:", amount);
          receipt = await spendNative(
            receiverWallet as `0x${string}`,
            amount,
            "bnb" as networkType
          );
          console.log("BNB transaction result:", receipt);
          break;

        case "erc20":
          console.log("Processing ERC20 USDT transaction");
          receipt = await spendEVMUSDT(
            receiverWallet as `0x${string}`,
            parseUnits(truncateDecimals(amount, 6), 6),
            true
          );
          console.log("ERC20 transaction result:", receipt);
          break;

        case "bep20":
          console.log("Processing BEP20 USDT transaction");
          receipt = await spendEVMUSDT(
            receiverWallet as `0x${string}`,
            parseUnits(amount, 18)
          );
          console.log("BEP20 transaction result:", receipt);
          break;

        case "trc20":
          console.log("Processing TRC20 transaction");
          // TRC20 USDT uses 6 decimals, convert to smallest unit (sun)
          const trc20Amount = Math.floor(parseFloat(truncateDecimals(amount, 6)) * 1e6);
          const trc20Result = await spendTRC20(receiverWallet, trc20Amount);
          console.log("TRC20 transaction result:", trc20Result);
          trxSent = !!trc20Result?.result;
          break;

        case "btc":
          console.log("Processing BTC transaction");
          const txid = await sendBTC({
            senderAddress: btcPaymentAddress as WalletAddress,
            recipient: receiverWallet as WalletAddress,
            amount: parseFloat(amount),
            signPsbtFn: async (psbt: string) => {
              if (!btcPaymentAddress) {
                throw new Error("Payment address is undefined.");
              }

              const response = await request("signPsbt", {
                psbt: psbt,
                signInputs: {
                  [btcPaymentAddress]: [0],
                },
              });

              if (response.status === "success") {
                return response.result.psbt;
              } else {
                if (response.error.code === RpcErrorCode.USER_REJECTION) {
                  throw new Error("User cancelled the signing process.");
                } else {
                  throw new Error(`Error signing PSBT: ${response.error.message}`);
                }
              }
            },
          });
          btcSent = !!txid;
          break;

        case "trx":
          console.log("Processing TRX transaction");
          const trxTransaction = await spendTRX(
            receiverWallet as EthereumAddress,
            amount
          );
          trxSent = !!trxTransaction.txid;
          break;

        default:
          return { success: false, error: `Unsupported network: ${network}` };
      }

      // Check if transaction was successful
      const transactionSuccessful =
        (receipt && receipt.transactionHash && receipt.status === "success") ||
        btcSent ||
        trxSent;

      if (transactionSuccessful) {
        // Update payment store with active wallet
        usePaymentStore.getState().setActiveWallet(receiverWallet);
        usePaymentStore.getState().setWalletLastAssignedTime(new Date().toISOString());

        // Process the transaction (save to DB, display confirmation, etc.)
        await processTransaction();

        console.log("Blockchain payment successful");
        return { success: true };
      }

      return { success: false, error: "Transaction was not confirmed" };
    } catch (error) {
      console.error("Error processing blockchain payment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setWalletFetchError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    executePayment,
    isWalletConnected: isConnected,
    walletType,
    network,
  };
}
