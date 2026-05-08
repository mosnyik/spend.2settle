// import { MessageType } from "../types/general_types";

// // WELCOME USERS FOR COMING TO CUSTOMER SUPPORT
// export const displayCustomerSupportWelcome = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Here is your menu:
//           <br />
//           <br />
//           1. Make Enquiry
//           <br />
//           2. Make Complain
//           <br />
//           0. Go back
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("assurance");
//   addChatMessages(newMessages);
// };

// export const displayCustomerSupportAssurance = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: `Thanks for contacting support, please call us on +2349069400430`,
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("entreTrxId");
//   addChatMessages(newMessages);
// };

// export const displayEnterTransactionId = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: "Please enter your transaction_id",
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is entreTrxId");
//   nextStep("entreTrxId");
//   addChatMessages(newMessages);
// };
// export const displayMakeComplain = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           what is your complain in less than 100 words
//           <br />
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is start");
//   nextStep("makeComplain");
//   addChatMessages(newMessages);
// };
