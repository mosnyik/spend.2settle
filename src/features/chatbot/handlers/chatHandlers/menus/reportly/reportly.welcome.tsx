import useChatStore, { MessageType } from "stores/chatStore";

export const displayReportlyWelcome = async () => {
  const { addMessages } = useChatStore.getState();

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          <br />
          1. Track Transaction
          <br />
          2. Stolen funds | disappear funds
          <br />
          3. Fraud
          <br />
          0. Go back
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is reporterName");
  addMessages(newMessages);
};


// export const displayReportlyName = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Please enter your full name
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is reporterPhoneNumber");
//   next("reporterPhoneNumber");
//   addMessages(newMessages);
// };
// export const displayReportlyPhoneNumber = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Please enter your phone number
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is reporterWallet");
//   next("reporterWallet");
//   addMessages(newMessages);
// };
// export const displayReportlyReporterWalletAddress = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Please enter your wallet address
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is fraudsterWallet");
//   next("fraudsterWallet");
//   addMessages(newMessages);
// };
// export const displayReportlyFraudsterWalletAddress = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Please enter the fraudster wallet address (optional)
//           <br />
//           1. Skip
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is reportlyNote");
//   next("reportlyNote");
//   addMessages(newMessages);
// };
// export const displayReportlyNote = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Explain what happened in less than 100 words
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is reporterFarwell");
//   next("reporterFarwell");
//   addMessages(newMessages);
// };
// export const displayReportlyFarwell = async () => {
//     const { addMessages } = useChatStore.getState();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Thank you for submitting the report,
//           <br />
//           We get back to you shortly
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//     // go to home back
//   ];
//   console.log("Next is start");
//   next("start");
//   addMessages(newMessages);
// };
