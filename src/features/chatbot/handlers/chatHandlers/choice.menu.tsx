import { formatCurrency } from "@/helpers/format_currency";
import { shortWallet } from "@/helpers/ShortenAddress";
import { fetchRate } from "@/services/rate/rates.service";
import useChatStore, { MessageType } from "stores/chatStore";
import { useUserStore } from "stores/userStore";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayMakeChoice } from "./menus/display.make.choice";

export const choiceMenu = async (chatInput?: string) => {
  let rate: number | null = null;

  try {
    rate = await fetchRate();
  } catch (err) {
    console.error("Failed to fetch rate", err);
  }
  const { user } = useUserStore.getState();

  const telFirstName = user?.telegram?.username;
  const {addMessages } = useChatStore.getState();
  if (greetings.includes((chatInput ?? "").trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    addMessages?.([
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "ConnectButton",
          persist: true,
        },
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            1. Wallet have been Connected
            <br />
            0. Go back
            <br />
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  } else if (chatInput === "2") {
    displayMakeChoice();
  } else {
    addMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName}👋
            <br />
            <br />
            It seems you entered the wrong respose, try <b>hi,</b> <b>hey,</b>{" "}
            <b>hello</b> or <b>howdy</b>
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};

export async function choiceMenuRouter(input: string) {
  let rate: number | null = null;

  try {
    rate = await fetchRate();
  } catch (err) {
    console.error("Failed to fetch rate", err);
  }

  const { isConnected, address } = useWalletStore.getState();
  const walletIsConnected = isConnected;
  const wallet = address;

  const formatRate = formatCurrency(rate?.toString() ?? "0", "NGN", "en-NG");

  const telFirstName = "Mosnyik";

  const { addMessages } = useChatStore.getState();

  const chatInput = (input ?? "").trim().toLowerCase();

  if (greetings.includes(chatInput)) {
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
              5. Reportly
            </span>
          ),
          timestamp: new Date(),
        },
      ] as MessageType[]);
    } else {
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued <b>without connecting your wallet</b>
              <br />
              <br />
              Today Rate: <b>{formatRate}/$1</b>
              <br />
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
  }

  if (chatInput === "1") {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName} 👋
            <br />
            <br />I see what you did there, you want to connect wallet abi?
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }

  if (chatInput === "2") {
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
              5. Reportly
            </span>
          ),
          timestamp: new Date(),
        },
      ] as MessageType[]);
    } else {
      addMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued <b>without connecting your wallet</b>
              <br />
              <br />
              Today Rate: <b>{formatRate}/$1</b>
              <br />
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
  }

  // ----------------------------
  // FALLBACK
  // ----------------------------
  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          How far {telFirstName} 👋
          <br />
          <br />
          It seems you entered the wrong response, try <b>hi</b>, <b>hey</b>,{" "}
          <b>hello</b> or <b>howdy</b>
        </span>
      ),
      timestamp: new Date(),
    },
  ]);
}
