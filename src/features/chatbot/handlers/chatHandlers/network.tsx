import { getWalletType } from "@/helpers/transaction/transact_crypto";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { getAccount } from "wagmi/actions";
import { config } from "@/wagmi";
import { displayEnterPhone } from "./menus/display.phone";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";

export const handleNetwork = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const { paymentMode } = usePaymentStore.getState();

   const { isConnected, address }= useWalletStore.getState()

  const walletIsConnected = isConnected;
  const wallet = address;

  const { assetPrice, setAssetPrice, setCrypto, setTicker, setNetwork } =
    usePaymentStore.getState();

  const { rate } = usePaymentStore.getState();
  setAssetPrice(rate);

  const walletType = getWalletType(wallet);

  const isRequest = paymentMode.toLowerCase() === "payrequest";
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      //   displayTransferMoney();
    })();
  } else if (chatInput === "1") {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("ERC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker }); // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone(addChatMessages, nextStep);
    // } else {
    //   if (walletIsConnected && walletType !== "EVM") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `USDT (ERC20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {

    // nextStep();

    console.log({ isRequest });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
    //   }
    // }
  } else if (chatInput === "2") {
    // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone();
    // } else {
    //   if (walletIsConnected && walletType !== "TRX") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `TRC20 is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("TRC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });

    // nextStep();
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
    //   }
    // }
  } else if (chatInput === "3") {
    // sharedGiftId
    // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone(addChatMessages, nextStep);
    // } else {
    //   if (walletIsConnected && walletType !== "EVM") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `USDT (BEP20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("BEP20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
    //   }
    // }
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Choose your prefered network or say Hi if you are stock.",
        timestamp: new Date(),
      },
    ]);
  }
};
