import { formatCurrency } from "@/helpers/format_currency";
import { shortWallet } from "@/helpers/ShortenAddress";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";
import { getRate } from "@/services/rate/getRates";
import useChatStore, { MessageType } from "stores/chatStore";
import { useUserStore } from "stores/userStore";

export const displayMakeChoice = async () => {
  let rate: number | null = null;

  try {
    rate = await getRate();
  } catch (err) {
    console.error("Failed to fetch rate", err);
  }
  const { isConnected, address }= useWalletStore.getState()
  const { user } = useUserStore.getState();

  const walletIsConnected = isConnected;
  const wallet = address;

  const formatRate = formatCurrency(rate?.toString() ?? "0", "NGN", "en-NG");

  const telFirstName = user?.telegram?.username;
  const { next, addMessages } = useChatStore.getState();
  if (walletIsConnected) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName} 👋
            <br />
            <br />
            You are connected as <b>{shortWallet(wallet)}</b>
            <br />
            <br />
            Your wallet is connected. The current rate is
            <b> {formatRate}/$1</b>
          </span>
        ),
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            1. Transact Crypto
            <br />
            2. Request for paycard
            <br />
            3. Customer support
            <br />
            4. Transaction ID
            <br />
            5. Reportly,
          </span>
        ),
        timestamp: new Date(),
      },
    ] as unknown as MessageType[]);
    next({
      stepId: "makeAChoice",
    });
  } else {
    {
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued <b>without connecting your wallet</b>
              <br />
              <br />
              Today Rate: <b>{formatRate}/$1</b> <br />
              <br />
              Welcome to 2SettleHQ {telFirstName}, how can I help you today?
            </span>
          ),
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              1. Transact Crypto
              <br />
              2. Request for paycard
              <br />
              3. Customer support
              <br />
              4. Transaction ID
              <br />
              5. Reportly
              <br />
              0. Back
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
    }
    next({
      stepId: "makeAChoice",
    });
  }
};
