import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore from "stores/chatStore";
import { helloMenu } from "./hello.menu";
import { displayTransferMoney } from "./menus/transfer.money";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { usePaymentStore } from "stores/paymentStore";

export const handleTransferMoney = async (chatInput: string) => {
  const { addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;

    displayHowToEstimation({ crypto, ticker });
    // nextStep();
    // nextStep("estimateAsset");
  } else if (chatInput === "2") {
    // displayTransferMoney(addMessages);
    // setSharedPaymentMode("Gift");
    // nextStep();
    // nextStep("estimateAsset");
  } else if (chatInput === "3") {
    // displayPayIn(
    //   addMessages,
    //   "Naira",
    //   sharedRate,
    //   "",
    //   "",
    //   sharedPaymentMode
    // );
    // setSharedEstimateAsset("Naira");
    // nextStep();
    // nextStep("enterBankSearchWord");
    // setSharedPaymentMode("request");
  }
  // else if (sharedPaymentMode.toLowerCase().trim() === "payrequest") {
  //   console.log("Lets see what is sent", chatInput);
  //   try {
  //     // check if request exist and proceed accordingly
  //     setLoading(true);
  //     const request = await checkRequestExists(chatInput.trim());
  //     const requestExists = request.exists;
  //     //  const userDateToUse = {
  //     //    crypto: sharedCrypto,
  //     //    network: sharedNetwork,
  //     //    estimation: sharedEstimateAsset,
  //     //    Amount: parseFloat(sharedPaymentAssetEstimate)
  //     //      .toFixed(8)
  //     //      .toString(),
  //     //    charges: sharedChargeForDB,
  //     //    mode_of_payment: sharedPaymentMode,
  //     //    acct_number: bankData.acct_number,
  //     //    bank_name: bankData.bank_name,
  //     //    receiver_name: bankData.receiver_name,
  //     //    receiver_amount: formatCurrency(
  //     //      sharedPaymentNairaEstimate,
  //     //      "NGN",
  //     //      "en-NG"
  //     //    ),
  //     //    crypto_sent: paymentAsset,
  //     //    wallet_address: activeWallet,
  //     //    Date: date,
  //     //    status: "Processing",
  //     //    customer_phoneNumber: formatPhoneNumber(phoneNumber),
  //     //    transac_id: transactionID.toString(),
  //     //    settle_walletLink: "",
  //     //    chat_id: chatId,
  //     //    current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
  //     //    merchant_rate: merchantRate,
  //     //    profit_rate: profitRate,
  //     //    name: "",
  //     //    asset_price:
  //     //      sharedCrypto.toLowerCase() != "usdt"
  //     //        ? formatCurrency(sharedAssetPrice, "USD")
  //     //        : formatCurrency(sharedRate, "NGN", "en-NG"),
  //     //  };
  //     if (requestExists) {
  //       // populate the userData with available data
  //       setSharedGiftId(chatInput.trim());
  //       setLoading(false);
  //       displayTransferMoney(addMessages);
  //       nextStep();
  //       // nextStep("estimateAsset");
  //     } else {
  //       setLoading(false);
  //       addMessages([
  //         {
  //           type: "incoming",
  //           content: `Invalid request_id. Try again`,
  //           timestamp: new Date(),
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     addMessages([
  //       {
  //         type: "incoming",
  //         content: "Error fetching request. Please try again.",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  else {
    addMessages([
      {
        type: "incoming",
        content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        timestamp: new Date(),
      },
    ]);
  }
};
