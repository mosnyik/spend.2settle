import { useAccount, useChainId } from "wagmi";

export function useActiveNetwork() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  return { isConnected, chainId };
}
