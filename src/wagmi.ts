import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  bsc,
  arbitrum,
  base,
  optimism,
  polygon,
  sepolia,
  bscTestnet,
  bscGreenfield,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "2settle Livechat",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    bscTestnet,
    bscGreenfield,

    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

