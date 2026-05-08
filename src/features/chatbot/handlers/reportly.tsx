// /**
//  * reportly sequence
//  */

// import {
//   countWords,
//   getLastReportId,
//   getNextReportID,
//   isValidWalletAddress,
//   makeAReport,
// } from "@/helpers/api_call/reportly_page_calls";
// import {
//   displayReportlyFarwell,
//   displayReportlyFraudsterWalletAddress,
//   displayReportlyName,
//   displayReportlyReporterWalletAddress,
// } from "@/menus/reportly";
// import { MessageType } from "@/types/general_types";
// import { formatPhoneNumber, phoneNumberPattern } from "@/utils/utilities";
// import { reportData } from "../../../types/reportly_types";
// import { greetings } from "../helpers/ChatbotConsts";
// import { helloMenu, welcomeMenu } from "./general";
// import { WalletAddress } from "@/lib/wallets/types";
// import { StepId } from "@/core/machines/steps";

// export type DisplayReportlyPhoneNumber = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => void;

// // CUSTOMER REPORTLY SEQUENCE FUNCTIONS

// // first page for reportly, with 3 options and goBack
// export const handleReportlyWelcome = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   sharedRate: string,
//   chatInput: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setSharedReportlyReportType: (reportlyType: string) => void,
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
//       console.log("Going back from handleReportlyWelcome");
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
//       welcomeMenu(
//         addChatMessages,
//         sharedRate,
//         walletIsConnected,
//         wallet,
//         telFirstName
//       );
//     })();
//   } else if (chatInput === "1") {
//     setSharedReportlyReportType("Track Transaction");
//     console.log("Omo, na to report Track Transaction, input is: ", chatInput);
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     console.log("Omo, na to report Stolen funds, input is: ", chatInput);
//     setSharedReportlyReportType("Stolen funds | disappear funds");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     console.log("Omo, na to report Fraud, input is: ", chatInput);
//     setSharedReportlyReportType("Fraud");
//     displayReportlyName(addChatMessages, nextStep);
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

// export const handleReporterName = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedReportlyReportType: (reportlyType: string) => void,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//   } else if (chatInput === "1") {
//     setSharedReportlyReportType("Track Transaction");
//     console.log("Omo, na to report Track Transaction");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     console.log("Omo, na to report Stolen funds");
//     setSharedReportlyReportType("Stolen funds | disappear funds");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     console.log("Omo, na to report Fraud");

//     setSharedReportlyReportType("Fraud");
//     displayReportlyName(addChatMessages, nextStep);
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
// // Option to allow user tract transaction, enter name or goBack to the very start
// export const handleEnterReporterPhoneNumber = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   reporterName: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   setReporterName: (reporterName: string) => void,
//   displayReportlyPhoneNumber: DisplayReportlyPhoneNumber,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//       goToStep("reporterName");
//       displayReportlyName(addChatMessages, nextStep);
//     })();
//   } else {
//     const name = chatInput.trim();

//     if (name === "") {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a your name. You can not summit an empty space
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterName(chatInput.trim());
//     console.log(`Full name is ${reporterName}`);
//     displayReportlyPhoneNumber(addChatMessages, nextStep);
//   }
// };

// export const handleEnterReporterWalletAddress = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   reporterPhoneNumber: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setReporterPhoneNumber: (phoneNumber: React.SetStateAction<string>) => void,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//       displayReportlyName(addChatMessages, nextStep);
//     })();
//   } else {
//     let phoneNumber = chatInput.trim();
//     if (!phoneNumberPattern.test(phoneNumber)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid phone number, <b>{phoneNumber}</b> is not a
//               valid phone number.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterPhoneNumber(phoneNumber);
//     console.log(`Reporter phone number  is ${reporterPhoneNumber}`);
//     displayReportlyReporterWalletAddress(addChatMessages, nextStep);
//   }
// };

// export const handleEnterFraudsterWalletAddress = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setReportId: (reportId: string) => void,
//   setReporterWalletAddress: (wallet: string) => void,
//   displayReportlyPhoneNumber: DisplayReportlyPhoneNumber,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//       displayReportlyPhoneNumber(addChatMessages, nextStep);
//     })();
//   } else {
//     const wallet = chatInput.trim();
//     const lastReportId = async () => {
//       try {
//         const lastReportId = await getLastReportId();
//         const lastId = getNextReportID(lastReportId);
//         const report_id = `Report_${lastId}`;

//         setReportId(report_id);
//       } catch (e) {
//         console.log("we got into a challenge bro", e);
//       }
//     };
//     lastReportId();
//     if (!isValidWalletAddress(wallet)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid wallet address, <b>{wallet}</b> is not a
//               valid wallet address.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterWalletAddress(wallet);

//     displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
//   }
// };

// export const handleReportlyNote = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setFraudsterWalletAddress: (wallet: string) => void,
//   displayReportlyNote: DisplayReportlyPhoneNumber,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//       displayReportlyReporterWalletAddress(addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "1") {
//     (() => {
//       goToStep("reportlyNote");
//       displayReportlyNote(addChatMessages, nextStep);
//     })();
//   } else {
//     const wallet = chatInput.trim();
//     if (!isValidWalletAddress(wallet)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid wallet address, <b>{wallet}</b> is not a
//               valid wallet address.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }

//     setFraudsterWalletAddress(wallet);
//     displayReportlyNote(addChatMessages, nextStep);
//   }
// };

// export const handleReporterFarwell = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   reporterName: string,
//   reporterPhoneNumber: string,
//   reporterWalletAddress: string,
//   fraudsterWalletAddress: string,
//   sharedReportlyReportType: string,
//   reportId: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   goToStep: (step: StepId) => void,
//   prevStep: () => void,
//   setDescriptionNote: (note: string) => void,
//   setReporterPhoneNumber: (phoneNumber: string) => void,
//   setReporterWalletAddress: (wallet: string) => void,
//   setFraudsterWalletAddress: (fraudsterWallet: string) => void,
//   setReporterName: (reporterName: string) => void,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
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
//       console.log("Going back from handleReportlyWelcome");
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
//       displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
//     })();
//   } else {
//     const note = chatInput.trim();

//     const wordCount = countWords(note);

//     if (!(wordCount <= 100)) {
//       console.log("word count is: ", wordCount);
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a note within the specified word count. Your note is{" "}
//               {wordCount} words long. The maximum allowed is 100 words.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }

//     setDescriptionNote(note);

//     const reportData: reportData = {
//       name: reporterName,
//       phone_Number: formatPhoneNumber(reporterPhoneNumber),
//       wallet_address: reporterWalletAddress,
//       fraudster_wallet_address: fraudsterWalletAddress,
//       description: note,
//       complaint: sharedReportlyReportType,
//       status: "pending",
//       report_id: reportId,
//       confirmer: "",
//     };
//     setLoading(true);
//     try {
//       await makeAReport(reportData);
//       // re write write_report api to throw error if we get any response other than 200
//       // if (response.status !== 200) {
//       //   throw new Error(`API responded with status ${response.status}`);
//       // }
//       setReporterName("");
//       setReporterPhoneNumber("");
//       setReporterWalletAddress("");
//       setFraudsterWalletAddress("");
//       setDescriptionNote("");
//       displayReportlyFarwell(addChatMessages, nextStep);
//       helloMenu(
//         addChatMessages,
//         "hi",
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Aje!!, there was a issue saving the report.
//               <br />
//               Maybe check your internet and try again or say 'hi' to go to the
//               start of the conversation
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       console.log("Aje!!, there was a issue saving the report", error);
//     }
//     return;
//   }
// };
