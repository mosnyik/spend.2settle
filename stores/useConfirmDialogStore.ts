import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: React.ReactNode | null;
  isConfirming: boolean;
  hasConfirmed: boolean;
  hasCopyButtonBeenClicked: boolean;
  walletIsExpired: boolean;
  walletFetchError: string;

  setWalletFetchError: (error: string) => void;
  setHasCopyButtonBeenClicked: (isClicked: boolean) => void;
  setWalletIsExpired: () => void;
  onConfirm?: () => Promise<void> | void;

  open: (config: {
    title?: string;
    description?: React.ReactNode;
    onConfirm?: () => Promise<void> | void;
  }) => void;

  close: () => void;
  confirm: () => Promise<void>;
  reset:()=> void;
}
export const useConfirmDialogStore = create<ConfirmDialogState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      title: "",
      description: null,
      isConfirming: false,
      hasConfirmed: false,
      hasCopyButtonBeenClicked: false,
      walletIsExpired: false,
      walletFetchError: "",

      setWalletFetchError: (error) => set({ walletFetchError: error }),
      setWalletIsExpired: () => set({ walletIsExpired: true }),

      setHasCopyButtonBeenClicked: (isClicked) =>
        set({ hasCopyButtonBeenClicked: isClicked }),

      open: ({ title, description, onConfirm }) =>
        set({
          isOpen: true,
          title,
          description,
          onConfirm,
          isConfirming: false,
          hasConfirmed: false,
        }),

      close: () =>
        set({
          isOpen: false,
          isConfirming: false,
          hasConfirmed: false,
          onConfirm: undefined,
        }),

      confirm: async () => {
        const { onConfirm, hasConfirmed, isConfirming, close } = get();

        if (!onConfirm || hasConfirmed || isConfirming) return;

        try {
          set({ isConfirming: true, hasConfirmed: true });
          await onConfirm();
          close();
        } catch (err) {
          console.error("Confirmation failed:", err);
          set({ hasConfirmed: false });
        } finally {
          set({ isConfirming: false });
        }
      },
      reset: () =>
        set({
          hasCopyButtonBeenClicked: false,
          walletIsExpired: false,
          walletFetchError: "",
        }),
    }),
    {
      name: "confirm-dialog-store",
      partialize: (state) => ({
        hasCopyButtonBeenClicked: state.hasCopyButtonBeenClicked,
        walletIsExpired: state.walletIsExpired,
      }),
    },
  ),
);
