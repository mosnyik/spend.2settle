// import Link from "next/link";
// import { MessageType } from "../types/general_types";

// // ALERT USERS OF THE DATA NEEDED FOR PAYCARD REQUEST
// export const displayKYCInfo = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           You will be directed to a KYC link, this details are required:
//           <br />
//           <br />
//           Bank details
//           <br />
//           Phone Number
//           <br />
//           Address
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           1. Continue
//           <br />
//           2. Cancel
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("kycReg");
//   addChatMessages(newMessages);
// };

// // GIVE USERS THE LINK TO REQUEST PAYCARD
// export const displayRegKYC = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           click this link:
//           <Link href="https://vendor.2settle.io" passHref>
//             {" "}
//             <a
//               className="text-blue-500"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               vendor form
//             </a>
//           </Link>
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Here is your menu:
//           <br />
//           1. Completed
//           <br />
//           2. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is thankForKYCReg");
//   nextStep("thankForKYCReg");
//   addChatMessages(newMessages);
// };
// // FAREWELL FROM USER REG
// export const displayThankForKYCReg = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Thank you for completing the process to your selected menu. Will you
//           like to do something else?
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is start");
//   nextStep("start");
//   addChatMessages(newMessages);
// };
