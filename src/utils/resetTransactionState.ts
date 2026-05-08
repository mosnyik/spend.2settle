import { useBankStore } from "stores/bankStore";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";
import { useConfirmDialogStore } from "stores/useConfirmDialogStore";

/**
 * Resets all transaction-related state after a transaction is completed.
 * This includes payment data, transaction data, bank data, and confirm dialog state.
 * Also resets the transaction type in the chat store.
 */
export const resetAllTransactionState = () => {
  // Reset payment store (keeps rates)
  const { reset: resetPayment } = usePaymentStore.getState();
  resetPayment();

  // Reset transaction store
  const { resetTransaction } = useTransactionStore.getState();
  resetTransaction();

  // Reset bank store
  const { resetBankData } = useBankStore.getState();
  resetBankData();

  // Reset confirm dialog store
  const { reset: resetConfirmDialog } = useConfirmDialogStore.getState();
  resetConfirmDialog();

  // Reset transaction type in chat store current step
  const { next, currentStep } = useChatStore.getState();
  if (currentStep.transactionType) {
    next({
      stepId: currentStep.stepId,
      transactionType: undefined,
    });
  }

  console.log("All transaction state has been reset");
};
