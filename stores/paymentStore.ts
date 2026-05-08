import { create } from "zustand";
import { persist } from "zustand/middleware";
interface PaymentData {
  paymentMode: string;
  crypto: string;
  ticker: string;
  network: string;
  activeWallet: string;
  assetPrice: string;
  estimateAsset: string;
  nairaCharge: string;
  dollarCharge: string;
  amountPayable: string;
  paymentAssetEstimate: string;
  paymentNairaEstimate: string;
  walletLastAssignedTime: string;
  chargeFrom: "fiat" | "crypto";

  rate: string;
  lastRateFetchedAt: number;

  profitRate: string;
  lastProfitRateFetchedAt: number;

  merchantRate: string;
  lastMerchantRateFetchedAt: number;

  totalVolume: string;
  lastTotalVolumeFetchedAt: number;
}
export type PaymentStoreType = PaymentData & {
  setRate: (val: string) => void;
  setWalletLastAssignedTime: (val: string) => void;
  setProfitRate: (val: string) => void;
  setMerchantRate: (val: string) => void;
  setTotalVolume: (val: string) => void;
  setPaymentMode: (val: string) => void;
  setCrypto: (val: string) => void;
  setTicker: (val: string) => void;
  setNetwork: (val: string) => void;
  setActiveWallet: (val: string) => void;
  setAssetPrice: (val: string) => void;
  setEstimateAsset: (val: string) => void;
  setNairaCharge: (val: string) => void;
  setDollarCharge: (val: string) => void;
  setAmountPayable: (val: string) => void;
  setPaymentAssetEstimate: (val: string) => void;
  setPaymentNairaEstimate: (val: string) => void;
  setChargeFrom: (val: "fiat" | "crypto") => void;

  reset: () => void;
};

const initialState: PaymentData = {
  rate: "",
  paymentMode: "",
  crypto: "",
  ticker: "",
  network: "",
  activeWallet: "",
  assetPrice: "",
  nairaCharge: "",
  dollarCharge: "",
  amountPayable: "",
  estimateAsset: "",
  paymentAssetEstimate: "",
  paymentNairaEstimate: "",
  walletLastAssignedTime: "",
  chargeFrom: "crypto",

  lastRateFetchedAt: 0,
  profitRate: "",
  lastProfitRateFetchedAt: 0,
  merchantRate: "",
  lastMerchantRateFetchedAt: 0,
  totalVolume: "",
  lastTotalVolumeFetchedAt: 0,
};

export const usePaymentStore = create<PaymentStoreType>()(
  persist(
    (set, get) => ({
      ...initialState,
      setPaymentMode: (val) => set({ paymentMode: val }),
      setWalletLastAssignedTime: (val) => set({ walletLastAssignedTime: val }),
      setCrypto: (val) => set({ crypto: val }),
      setTicker: (val) => set({ ticker: val }),
      setNetwork: (val) => set({ network: val }),
      setActiveWallet: (val) => set({ activeWallet: val }),
      setAssetPrice: (val) => set({ assetPrice: val }),
      setEstimateAsset: (val) => set({ estimateAsset: val }),
      setNairaCharge: (val) => set({ nairaCharge: val }),
      setDollarCharge: (val) => set({ dollarCharge: val }),
      setAmountPayable(val) {
        set({ amountPayable: val });
      },
      setPaymentAssetEstimate: (val) => set({ paymentAssetEstimate: val }),
      setPaymentNairaEstimate: (val) => set({ paymentNairaEstimate: val }),
      setChargeFrom: (val) => set({ chargeFrom: val }),
      setRate: (rate) => set({ rate, lastRateFetchedAt: Date.now() }),
      setProfitRate: (val: string) =>
        set({ profitRate: val, lastProfitRateFetchedAt: Date.now() }),
      setMerchantRate: (val: string) =>
        set({ merchantRate: val, lastMerchantRateFetchedAt: Date.now() }),
      setTotalVolume: (val: string) =>
        set({ totalVolume: val, lastTotalVolumeFetchedAt: Date.now() }),

      reset: () => {
        const valuesToKeep = {
          rate: get().rate,
          lastRateFetchedAt: get().lastRateFetchedAt,
          profitRate: get().profitRate,
          lastProfitRateFetchedAt: get().lastProfitRateFetchedAt,
          merchantRate: get().merchantRate,
          lastMerchantRateFetchedAt: get().lastMerchantRateFetchedAt,
          totalVolume: get().totalVolume,
          lastTotalVolumeFetchedAt: get().lastTotalVolumeFetchedAt,
        };

        const actions = {
          setRate: get().setRate,
          reset: get().reset,
          setPaymentMode: get().setPaymentMode,
          setWalletLastAssignedTime: get().setWalletLastAssignedTime,
          setCrypto: get().setCrypto,
          setTicker: get().setTicker,
          setNetwork: get().setNetwork,
          setActiveWallet: get().setActiveWallet,
          setAssetPrice: get().setAssetPrice,
          setEstimateAsset: get().setEstimateAsset,
          setNairaCharge: get().setNairaCharge,
          setDollarCharge: get().setDollarCharge,
          setAmountPayable: get().setAmountPayable,
          setPaymentAssetEstimate: get().setPaymentAssetEstimate,
          setPaymentNairaEstimate: get().setPaymentNairaEstimate,
          setChargeFrom: get().setChargeFrom,
          setProfitRate: get().setProfitRate,
          setMerchantRate: get().setMerchantRate,
          setTotalVolume: get().setTotalVolume,
        };

        // Reset to initial state but merge back the preserved values
        set({ ...initialState, ...valuesToKeep, ...actions }, true);
      },
    }),
    {
      name: "payment-store",
      partialize: (state) => ({
        walletLastAssignedTime: state.walletLastAssignedTime,
        activeWallet: state.activeWallet,
        network: state.network,
        rate: state.rate,
        lastRateFetchedAt: state.lastRateFetchedAt,
        profitRate: state.profitRate,
        lastProfitRateFetchedAt: state.lastProfitRateFetchedAt,
        merchantRate: state.merchantRate,
        lastMerchantRateFetchedAt: state.lastMerchantRateFetchedAt,
        totalVolume: state.totalVolume,
        lastTotalVolumeFetchedAt: state.lastTotalVolumeFetchedAt,
      }),
    },
  ),
);

// paymentMode: string;
// crypto: string;
// ticker: string;
// network: string;
// activeWallet: string;
// assetPrice: string;
// estimateAsset: string;
// nairaCharge: string;
// dollarCharge: string;
// amountPayable: string;
// paymentAssetEstimate: string;
// paymentNairaEstimate: string;
// walletLastAssignedTime: string;

// rate: string;
// lastRateFetchedAt: number;

// profitRate: string;
// lastProfitRateFetchedAt: number;

// merchantRate: string;
// lastMerchantRateFetchedAt: number;

// totalVolume: string;
// lastTotalVolumeFetchedAt: number;
