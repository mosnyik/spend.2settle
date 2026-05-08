// import { WalletStrategy, WalletAddress } from "./types";
// //  import { useAccount, useConnect } from "wagmi"
// import * as wagmi from "wagmi";

// export class ETHWallet implements WalletStrategy {
//   get isConnected(): boolean {
//     // return useAccount().isConnected;
//     return wagmi.useAccount().isConnected;
//   }
//   // isConnected: boolean = true;
//   getWalletAddress() {
//     // Logic to get the balance of the wallet
//     return "ethWalletAddress" as WalletAddress;
//   }
//   getBalance() {
//     // Logic to get the balance of the wallet
//     return 0;
//   }
//   getENS() {
//     // Logic to get the balance of the wallet
//     return "ethWalletENS";
//   }
//   async connect(): Promise<string> {
//     const res = wagmi.useConnect();
//     return (res.data?.accounts[0] as WalletAddress) || "";
//   }
 
//   disconnect(): Promise<void> {
//       throw new Error("Method not implemented.");
//   }
// }

