export interface TransactionRequest{

}


export interface WalletStrategy {
  readonly type: WalletType;
  connect(): Promise<void>; // Trigger connection to wallet
  disconnect(): Promise<void>; // Disconnect wallet
  isConnected: boolean;
  getAddress(): Promise<string>; // Get current wallet address
  getNetwork(): Promise<string | number>; // EVM: chainId, BTC: network name
  sendTransaction(tx: TransactionRequest ): Promise<string>
  signMessage?(msg: string): Promise<string>

  onAccountChanged?( callback: (address: string)=> void): void
  onNetworkChanged?( callback: (network: string| number )=> void):void

}

export type WalletAddress =
  | `0x${string}` // EVM wallet
  | `1${string}` // Legacy BTC (P2PKH)
  | `3${string}` // BTC multisig (P2SH)
  | `bc1${string}` // SegWit address
  | `T${string}` // TRON wallet address
  | undefined;

export type WalletType = "BTC" | "EVM" | "TRC20"| "TRX" | "UNKNOWN";
