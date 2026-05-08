import { create } from "zustand";

export type SupportStoreType = {
  reportlyReportType: string;
  setReportlyReportType: (val: string) => void;
};

export const useSupportStore = create<SupportStoreType>((set) => ({
  reportlyReportType: "",
  setReportlyReportType: (val) => set({ reportlyReportType: val }),
}));
