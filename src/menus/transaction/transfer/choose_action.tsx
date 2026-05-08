// import ConnectWallet from "@/components/crypto/ConnectWallet";
// import { StepId } from "@/core/machines/steps";
// import { helloMenu } from "@/features/chatbot/handlers/general";
// import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
// import { formatCurrency } from "@/helpers/format_currency";
// import ShortenedAddress from "@/helpers/ShortenAddress";
// import { WalletAddress } from "@/lib/wallets/types";
// import { fetchProfitRate } from "@/services/transactionService/transferService/rates";
// import { MessageType } from "stores/chatStore";
// import { usePaymentStore } from "stores/paymentStore";

// let formatRate: string;
// setTimeout(() => {
//   formatRate = usePaymentStore.getState().rate;
// }, 2500);

// export const choiceMenu = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   formattedRate: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   const choice = chatInput.trim();
//   if (greetings.includes(choice.toLowerCase())) {
//     // helloMenu(choice);
//     helloMenu(
//       addChatMessages,
//       choice,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//     goToStep("start");
//   } else if (choice === "0") {
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
//   } else if (choice.toLowerCase() === "1") {
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectWallet />,
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//       // nextStep("transactCrypto");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectWallet />,
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//       // nextStep("transactCrypto");
//     }
//   } else if (choice.toLowerCase() === "2") {
//     // console.log("Rate is", formatRate);
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued <b>without connecting your wallet</b>
//               <br />
//               <br />
//               Today Rate: <b>{formatRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued as{" "}
//               <b>
//                 <ShortenedAddress wallet={wallet} />
//               </b>
//               <br />
//               <br />
//               Today Rate: <b>{formatRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       // nextStep("transactCrypto");
//       nextStep();
//     }
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: (
//           <span>
//             You need to make a valid choice
//             <br />
//             <br />
//             Please Try again, or say 'Hi' or 'Hello' to start over
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
