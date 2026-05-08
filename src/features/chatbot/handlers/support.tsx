// /**
//  * handle compliants, reports and support messaging
//  */

// import { checkTranscationExists, createComplain } from "@/helpers/api_calls";
// import {
//   displayCustomerSupportAssurance,
//   displayCustomerSupportWelcome,
//   displayEnterTransactionId,
//   displayMakeComplain,
// } from "@/menus/customer_support";
// import {
//   displayEnterCompleteTransactionId,
//   displayEnterId,
// } from "@/menus/transaction_id";
// import { MessageType } from "@/types/general_types";
// import { generateComplainId } from "@/utils/utilities";
// import { greetings } from "../helpers/ChatbotConsts";
// import {
//   displayKYCInfo,
//   displayRegKYC,
//   displayThankForKYCReg,
// } from "@/menus/request_paycard";
// import { choiceMenu, helloMenu } from "./general";
// import { WalletAddress } from "@/lib/wallets/types";
// import { StepId } from "@/core/machines/steps";

// // CUSTOMER SUPPORT SEQUENCE FUNCTIONS

// // ALLOW USER TO USER THEIR TRANSACTION ID TO MAKE A COMPLAIN
// export const handleCustomerSupportAssurance = (
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
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       displayCustomerSupportWelcome(addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "1") {
//     displayCustomerSupportAssurance(addChatMessages, nextStep);
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//     //   helloMenu("hi");
//   } else if (chatInput === "2") {
//     displayEnterTransactionId(addChatMessages, nextStep);
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

// // ALLOW USERS ENTER TRANSACTION ID
// export const handleTransactionId = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedTransactionId: (step: string) => void,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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
//   } else if (chatInput !== "0") {
//     const transaction_id = chatInput.trim();
//     setLoading(true);
//     setSharedTransactionId(transaction_id);
//     const transactionExists = (await checkTranscationExists(transaction_id))
//       .exists;

//     console.log(
//       "User phone:",
//       (await checkTranscationExists(transaction_id)).user?.customer_phoneNumber
//     );

//     setLoading(false);
//     // IF TRANSACTION_ID EXIST IN DB,
//     if (transactionExists) {
//       displayMakeComplain(addChatMessages, nextStep);
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Invalid transaction_id. Try again",
//           timestamp: new Date(),
//         },
//       ]);
//     }
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

// // MAKE COMPLAIN
// export const handleMakeComplain = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   sharedTransactionId: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu(
//         addChatMessages,

//         "hi",
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayEnterTransactionId(addChatMessages, nextStep);
//     })();
//   } else if (chatInput !== "0") {
//     const message = chatInput.trim();
//     const words = message.trim().split(/\s+/);
//     let validMessage = words.length < 100 ? true : false;
//     // IF TRANSACTION_ID EXIST IN DB,

//     if (validMessage) {
//       setLoading(true);
//       const complainId = generateComplainId();
//       const phone = (await checkTranscationExists(sharedTransactionId)).user
//         ?.customer_phoneNumber;
//       console.log("User phone number is:", phone);

//       await createComplain({
//         transaction_id: sharedTransactionId,
//         complain: message,
//         status: "pending",
//         Customer_phoneNumber: phone,
//         complain_id: complainId,
//       });
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Your complain is noted.You can also reach out to our customer care. +2349069400430 if you don't want to wait",
//           timestamp: new Date(),
//         },
//       ]);
//       // helloMenu("hi");
//       goToStep("start");
//     } else {
//       console.log("Invalid message length");
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid entry, Please enter your message in not more that 100 words",
//           timestamp: new Date(),
//         },
//       ]);
//       return;
//     }
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

// // // Allow user to enter transaction id to complete transaction

// // export const handleCompleteTransactionId = async (
// //   addChatMessages: (messages: MessageType[]) => void,
// //   chatInput: string,
// //   formattedRate: string,
// //   walletIsConnected: boolean,
// //   wallet: WalletAddress,
// //   telFirstName: string,
// //   nextStep: (step: string) => void,
// //   goToStep: (step: string) => void,
// //   prevStep: () => void,
// //   setSharedPaymentMode: (mode: string) => void
// // ) => {
// //   if (greetings.includes(chatInput.trim().toLowerCase())) {
// //     goToStep("start");
// //     helloMenu(
// //       addChatMessages,
// //       chatInput,
// //       nextStep,
// //       walletIsConnected,
// //       wallet,
// //       telFirstName,
// //       setSharedPaymentMode
// //     );
// //   } else if (chatInput.trim() === "0") {
// //     (() => {
// //       prevStep();
// //       choiceMenu(
// //         addChatMessages,
// //         "2",
// //         walletIsConnected,
// //         wallet,
// //         telFirstName,
// //         formattedRate,
// //         nextStep,
// //         prevStep,
// //         goToStep,
// //         setSharedPaymentMode
// //       );
// //     })();
// //   } else if (chatInput === "1") {
// //     displayEnterCompleteTransactionId(addChatMessages, nextStep);
// //   } else if (chatInput === "2") {
// //     console.log("Let's see what is going on HERE!!!");
// //     displayEnterId(addChatMessages, nextStep, "Claim Gift");
// //     setSharedPaymentMode("Claim Gift");
// //   } else if (chatInput === "3") {
// //     displayEnterId(addChatMessages, nextStep, "request");
// //     setSharedPaymentMode("request");
// //   }
// // };

// export const handleKYCInfo = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
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
//   } else if (chatInput === "1") {
//     displayKYCInfo(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//     goToStep("start");
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

// // GIVE USERS LINK TO REG
// export const handleRegKYC = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
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
//   } else if (chatInput === "1") {
//     displayRegKYC(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//     goToStep("start");
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

// // GIVE USERS LINK TO REG
// export const handleThankForKYCReg = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
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
//   } else if (chatInput === "1") {
//     displayThankForKYCReg(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
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
