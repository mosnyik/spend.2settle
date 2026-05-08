import { TronWeb } from "tronweb";

export {};
declare global {
  interface EthereumProvider {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, listener: (...args: any[]) => void) => void;
    removeListener?: (
      event: string,
      listener: (...args: any[]) => void
    ) => void;
  }
  interface Window {
    ethereum?: EthereumProvider;
    tronLink?: any;
    tronWeb: TronWeb & {
      ready: boolean;
      isTronLink: boolean;
      defaultAddress: {
        base58: string;
        hex: string;
      };
      toSun: (amount: number | string) => number;
      fromSun: (amount: number | string) => number;
      trx: {
        getBalance: (address: string) => Promise<number>;
        sendTransaction: (
          to: String,
          amount: number
        ) => Promise<{ result: boolean; txid: string }>;
      };
    };
  }
}
