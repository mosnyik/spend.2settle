// import { StepId } from "@/core/machines/steps";
// import { helloMenu } from "@/features/chatbot/handlers/general";
// import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
// import { WalletAddress } from "@/lib/wallets/types";
// import { displayCustomerSupportWelcome } from "@/menus/customer_support";
// import { displayReportlyWelcome } from "@/menus/reportly";
// import { displayKYCInfo } from "@/menus/request_paycard";
// import { displayTransactCrypto } from "@/menus/transact_crypto";
// import { displayTransactIDWelcome } from "@/menus/transaction_id";
// import { MessageType } from "stores/chatStore";

// export const handleMakeAChoice = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(
//       addChatMessages,
//       chatInput,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "00") {
//     goToStep("start");
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "0") {
//     console.log("Previous going back")
//     prevStep();
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "1") {
//     // console.log("The choice is ONE, TRANSACT CRYPTO");
//     displayTransactCrypto(addChatMessages);

//     nextStep();
//     // nextStep("transferMoney");
//   } else if (chatInput === "2") {
//     // console.log("The choice is TWO, REQUEST PAY CARD");
//     displayKYCInfo(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     displayCustomerSupportWelcome(addChatMessages, nextStep);
//   } else if (chatInput === "4") {
//     // console.log("The choice is FOUR, TRANSACTION ID");
//     displayTransactIDWelcome(addChatMessages, nextStep);
//   } else if (chatInput === "5") {
//     // console.log("The choice is FIVE, REPORTLY");
//     displayReportlyWelcome(addChatMessages, nextStep);
//     // nextStep("transferMoney");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };