import { TransactionType } from "@/services/transactionService/transaction_types";
import { create } from "zustand";

type TransactionStore = {
  giftId: string;
  transferId: string;
  requestId: string;
  transactionId: string;
  transaction: TransactionType | null;
  setTransaction: (data: TransactionType) => void;
  setGiftId: (val: string) => void;
  setTransferId: (val: string) => void;
  setRequestId: (val: string) => void;
  setTransactionId: (val: string) => void;
  updateTransaction: (partial: Partial<TransactionType>) => void;
  resetTransaction: () => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  giftId: '',
  transferId: '',
  requestId: '',
  transactionId: '',
  transaction: null,
  setGiftId: (val) => set({ giftId: val }),
  setTransferId: (val) => set({ transferId: val }),
  setRequestId: (val) => set({ requestId: val }),
  setTransactionId: (val) => set({ transactionId: val }),
  setTransaction: (data) => set({ transaction: data }),
  updateTransaction: (partial) =>
    set((store) => ({
      transaction: { ...store.transaction, ...partial } as TransactionType,
    })),
  resetTransaction: () => set({ transaction: null, giftId: '', transferId: '', requestId: '', transactionId: '' }),
}));
