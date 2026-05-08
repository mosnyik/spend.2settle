// import { BtcWallet } from "./btcWallet";
// import { ETHWallet } from "./ethWallet";
// import { TronWallet } from "./trxWallet";
// import { WalletStrategy, WalletType } from "./types";

// export class WalletContext {
//   private _strategy: WalletStrategy;

//   constructor(type: WalletType) {
//     switch (type) {
//       case "BTC":
//         this._strategy = new BtcWallet();
//         break;
//       case "TRC20":
//         this._strategy = new TronWallet();
//         break;
//       default:
//         this._strategy = new ETHWallet();
//     }
//   }
//   isConnected() {
//     return this._strategy.isConnected;
//   }
//   connect() {
//     return this._strategy.connect();
//   }
//   disconnect() {
//     return this._strategy.disconnect();
//   }
//   getWalletAddress() {
//     return this._strategy.getWalletAddress();
//   }
//   getBalance() {
//     return this._strategy.getBalance();
//   }
//   getENS() {
//     return this._strategy.getENS();
//   }
// }
