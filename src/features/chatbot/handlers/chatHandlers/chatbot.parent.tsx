import ConnectWallet from "@/components/crypto/ConnectWallet";
import useChatStore from "stores/chatStore";
import { useAccount } from "wagmi";

export function ConnectWalletWithChat() {
  return <ConnectWallet />;
}
export const connectWallet = async () => {
  const { next, addMessages } = useChatStore.getState();

  console.log("We are connecting wallet");

  addMessages([
    {
      type: "incoming",
      intent: { kind: "component", name: "ConnectWallet", persist: false },
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          To go back type 0:
          <br />
          <br />
          0. Go back
        </span>
      ),
      timestamp: new Date(),
    },
  ]);

  next({
    stepId: "chooseAction",
  });
};
