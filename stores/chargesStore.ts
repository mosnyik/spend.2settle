import { create } from "zustand";

type ChargesStoreType = {
  amount: string;
  charge: string;
  nairaCharge: string;
  chargeForDB: string;

  setAmount: (val: string) => void;
  setCharge: (val: string) => void;
  setNairaCharge: (val: string) => void;
  setChargeForDB: (val: string) => void;
};

export const useChargesStore = create<ChargesStoreType>((set) => ({
  amount: "",
  charge: "",
  nairaCharge: "",
  chargeForDB: "",

  setAmount: (val) => set({ amount: val }),
  setCharge: (val) => set({ charge: val }),
  setNairaCharge: (val) => set({ nairaCharge: val }),
  setChargeForDB: (val) => set({ chargeForDB: val }),
}));
