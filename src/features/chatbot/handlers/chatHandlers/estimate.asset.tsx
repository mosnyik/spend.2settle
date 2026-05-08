import { MessageType } from "stores/chatStore";
import { helloMenu } from "./hello.menu";
import { greetings } from "../../helpers/ChatbotConsts";
import { config } from "@/wagmi";
import useChatStore from "stores/chatStore";
import { getAccount } from "wagmi/actions";
import { shortWallet } from "@/helpers/ShortenAddress";
import { getWalletType } from "@/helpers/transaction/transact_crypto";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { usePaymentStore } from "stores/paymentStore";
import { displayEnterPhone } from "./menus/display.phone";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";

export const handleEstimateAsset = async (chatInput: string) => {
  const { isConnected, address } = useWalletStore.getState();

  const walletIsConnected = isConnected;
  const wallet = address;
  const walletType = getWalletType(wallet);

  console.log("User chatinput", chatInput);

  const { addMessages } = useChatStore.getState();
  const { crypto, ticker, paymentMode } = usePaymentStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "0") {
    (() => {
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: (
            <span>
              Here is your menu:
              <br />
              <br />
              1. Transfer money
              <br />
              2. Send Gift
              <br />
              3. Request for payment
              <br />
              0. Go back
            </span>
          ),
          timestamp: new Date(),
        },
      ];
      console.log("Next is howToEstimate");
      addMessages(newMessages);
    })();
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    if (walletIsConnected && walletType !== "BTC") {
      addMessages([
        {
          type: "incoming",
          content: `BTC is only supported when BTC wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (paymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone();
    } else {
      displayHowToEstimation({
        crypto,
        ticker,
      });
      // nextStep();
      // nextStep("payOptions");
    }
  } else if (chatInput === "2") {
    if (walletIsConnected && walletType !== "EVM") {
      addMessages([
        {
          type: "incoming",
          content: `ETH is only supported when ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (paymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone();
    } else {
      displayHowToEstimation({
        crypto,
        ticker,
      });
    }
  } else if (chatInput === "3") {
    if (walletIsConnected && walletType !== "EVM") {
      addMessages([
        {
          type: "incoming",
          content: `BNB is only supported when BNB/ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (paymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone();
    } else {
      displayHowToEstimation({
        crypto,
        ticker,
      });
    }
  } else if (chatInput === "4") {
    if (walletIsConnected && walletType !== "TRX") {
      addMessages([
        {
          type: "incoming",
          content: `TRX is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (paymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone();
    } else {
      displayHowToEstimation({
        crypto,
        ticker,
      });
    }
  } else if (chatInput === "5") {
    if (walletIsConnected && walletType !== "EVM" && walletType !== "TRX") {
      addMessages([
        {
          type: "incoming",
          content: `USDT is only supported when ETH or TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: (
          <span>
            select Network: <br />
            <br />
            1. ERC20 <br />
            2. TRC20 <br />
            3. BEP20
            <br /> <br />
            0. Go back <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ];

    addMessages(newMessages);
    // setSharedTicker("USDT");
    // setSharedCrypto("USDT");
    // nextStep();
    // nextStep("network");
  } else {
    addMessages([
      {
        type: "incoming",
        content: "Invalid choice. Choose a valid estimate asset",
        timestamp: new Date(),
      },
    ]);
  }
};
