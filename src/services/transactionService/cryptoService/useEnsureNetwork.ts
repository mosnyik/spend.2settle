import { useSwitchChain } from "wagmi";
import { CHAINS } from "./chainConfig";

export function useEnsureNetwork() {
  const { switchChainAsync } = useSwitchChain();

  async function ensureNetwork(targetChain: keyof typeof CHAINS) {
    const target = CHAINS[targetChain];
    const chainID = window.ethereum?.networkVersion
      ? parseInt(window.ethereum.networkVersion)
      : undefined;

    console.log("chainId is", chainID);
    if (chainID !== target.id) {
      await switchChainAsync({ chainId: target.id });
      console.log(`Switched to ${target.name}`);
    }
  }
  return { ensureNetwork };
}
