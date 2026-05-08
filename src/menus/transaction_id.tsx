// import { MessageType } from "../types/general_types";

// // WELCOME USER TO TRANSACTION ID
// export const displayTransactIDWelcome = (
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
//           1. Complete your transaction
//           <br />
//           2. Claim Gift
//           <br />
//           3. Complete payment
//           <br />
//           0. Go back
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("completeTransactionId");
//   addChatMessages(newMessages);
// };

// // DISPLAY COMPLETE TRANSACTION
// export const displayCompleteTransaction = (
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
//           1. Complete your transaction
//           <br />
//           2. Claim Gift
//           <br />
//           3. Complete payment
//           <br />
//           0. Go back
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("completeTrxID");
//   addChatMessages(newMessages);
// };

// // ENTER TRANSACTION ID
// export const displayEnterCompleteTransactionId = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Enter your Transaction ID.
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is entreTrxId");
//   nextStep("confirmTransaction");
//   addChatMessages(newMessages);
// };
// // TRANSACTION FEEDBACK MESSAGE
// export const displayCompleteTrxFeedbackMessage = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: "This transaction is Processing",
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is entreTrxId");
//   nextStep("start");
//   addChatMessages(newMessages);
// };

// // Allow user to enter gift or request id to complete transaction
// export const displayEnterId = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   sharedPaymentMode: string
// ) => {
//   const queryId = sharedPaymentMode !== "payRequest" ? "Gift ID" : "Request ID";
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Enter your {queryId}.
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is giftFeedBack");
//   // We have to check the request here and fill in the userData
//   sharedPaymentMode === "Claim Gift"
//     ? nextStep("enterBankSearchWord")
//     : nextStep("transferMoney");
//   addChatMessages(newMessages);
// };
// // GIFT FEEDBACK MESSAGE
// export const displayGiftFeedbackMessage = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Your gift claim confirm is Successful!
//           <br />
//           Wait while we process your transaction...
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           You would recieve your credit in at most the next 15 mins,
//           <br />
//           If not contact support in '3. Customer support' above
//           <br />
//           <b>
//             Please make sure you check your balance before contacting support,
//             thank you
//           </b>
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is start");
//   nextStep("start");
//   addChatMessages(newMessages);
// };

// // ENTER REQUEST ID
// export const displayEnterRequestId = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Enter your Request ID.
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is giftFeedBack");
//   nextStep("requestFeedBack");
//   addChatMessages(newMessages);
// };
// // RETURN MESSAGE
// export const displayRequestFeedbackMessage = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: "This transaction is Processing",
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is start");
//   nextStep("start");
//   addChatMessages(newMessages);
// };
