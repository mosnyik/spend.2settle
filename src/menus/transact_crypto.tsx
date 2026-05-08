// import React, { ReactNode } from "react";
// import { MessageType, Result } from "../types/general_types";
// import { formatCurrency } from "../helpers/format_currency";
// import { checkRequestExists } from "@/helpers/api_calls";
// import { CopyableText } from "@/features/transact/CopyableText";

// // IF USER CHOOSE TRANSACT CRYPTO< THEY SEE THIS NEXT
// export const displayTransactCrypto = (
//   addChatMessages: (messages: MessageType[]) => void
// ) => {
//   {
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             1. Transfer money
//             <br />
//             2. Send Gift
//             <br />
//             3. Request for payment
//             <br />
//             0. Go back
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];
//     console.log("Next is howToEstimate");

//     addChatMessages(newMessages);
//   }
// };

// // IF USER CHOOSE TRANSACT CRYPTO< THEY SEE THIS NEXT
// export const displayPayAVendor = (
//   addChatMessages: (messages: MessageType[]) => void
// ) => {
//   {
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             1. Pay To A Bank
//             <br />
//             2. Pay A Vendor
//             <br />
//             0. Go back
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];
//     console.log("Next is howToEstimate");

//     addChatMessages(newMessages);
//   }
// };

// // IF USER CHOOSE TRANSFER MONEY THEY SEE THIS NEXT
// export const displayTransferMoney = (
//   addChatMessages: (messages: MessageType[]) => void
// ) => {
//   console.log("Let's start with selecting an actions");
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Pay with:
//           <br />
//           <br />
//           1. Bitcoin (BTC)
//           <br />
//           2. Ethereum (ETH)
//           <br />
//           3. BINANCE (BNB)
//           <br />
//           4. TRON (TRX)
//           <br />
//           5. USDT
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is howToEstimate");

//   addChatMessages(newMessages);
// };

// export const displayHowToEstimation = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   input: string,
//   sharedPaymentMode: string
// ) => {
//   const parsedInput = input.trim();
//   const ethChainId = 1;
//   const bnbChainId = 56;
//   const bnbTestChainId = 97;
//   const sopeliaChainId = 11155111;

//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: `How would you like to estimate your ${parsedInput}?`,
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Here is your menu:
//           <br />
//           <br />
//           1. Naira
//           <br />
//           2. Dollar
//           <br />
//           3. Crypto
//           <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];

//   console.log("Next is estimationAmount");
//   addChatMessages(newMessages);
// };

// export const displayRequestPaymentSummary = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   input: string,
//   sharedPaymentMode: string,
//   requestId: string
// ) => {
//   const parsedInput = input.trim();
//   const request = (await checkRequestExists(requestId)).user;
//   const requestAmount = request?.receiver_amount;
//   const requestReciever = request?.receiver_name;

//   const requestStatus = (await checkRequestExists(requestId)).exists;
//   console.log("Does request exist:", request?.receiver_amount);

//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: `You are paying ${requestAmount} worth of {BTC} to ${requestReciever}`,
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: `To complete this ${sharedPaymentMode} payment, you need to pay {0.005 BTC} to our wallet (charge included)`,
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is estimationAmount");
//   addChatMessages(newMessages);
// };

// // IF THE USER WANT TO PAYE WITH USDT THEY USE
// export const displayNetwork = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   input: string,
//   sharedPaymentMode: string
// ) => {
//   const parsedInput = input.trim();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           select Network: <br />
//           <br />
//           1. ERC20 <br />
//           2. TRC20 <br />
//           3. BEP20
//           <br /> <br />
//           0. Go back <br />
//           00. Exit
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];

//   console.log("Next is payOptions");
//   sharedPaymentMode !== "request"
//     ? nextStep("payOptions")
//     : nextStep("continueToPay");
//   addChatMessages(newMessages);
// };

// // THIS DISPLAYS ALLOWS USER TO ENTER THE AMOUNT HE WANTS TO PAY
// export const displayPayIn = (
//   addChatMessages: (messages: MessageType[]) => void,
//   sharedEstimateAsset: string,
//   sharedRate: string,
//   sharedTicker: string,
//   sharedAssetPrice: string,
//   sharedPaymentMode: string
// ) => {
//   const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
//   const dollar = ["usdt"];
//   const isCrypto = cryptocurrencies.includes(sharedEstimateAsset.toLowerCase());
//   const isDollar = dollar.includes(sharedEstimateAsset.toLowerCase());
//   const rate = parseFloat(sharedRate);
//   const upperDollar = 2000000 / rate;
//   const lowerDollar = 20000 / rate;
//   const assetPrice = parseFloat(sharedAssetPrice.trim().replace(/[^\d.]/g, ""));
//   let max: number;
//   let min: number;
//   if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
//     max = upperDollar;
//     min = lowerDollar;
//   } else {
//     max = upperDollar / assetPrice;
//     min = lowerDollar / assetPrice;
//   }

//   const rangeMessage = (
//     <span style={{ margin: 0, padding: 0 }}>
//       {sharedEstimateAsset.toLowerCase() === "naira" ? (
//         <>
//           Min. = {formatCurrency("20000", "NGN", "en-NG")}
//           <br />
//           Max. = {formatCurrency("2000000", "NGN", "en-NG")}
//         </>
//       ) : sharedEstimateAsset.toLowerCase() === "dollar" || isDollar ? (
//         <>
//           Min. = {formatCurrency(min.toFixed(2).toString(), "USD", "en-NG")}
//           <br />
//           Max. = {formatCurrency(max.toFixed(2).toString(), "USD")}
//         </>
//       ) : isCrypto ? (
//         <>
//           Min. = {min.toFixed(5)} {sharedTicker}
//           <br />
//           Max. = {max.toFixed(5)} {sharedTicker}
//         </>
//       ) : (
//         ""
//       )}
//     </span>
//   );
//   console.log("Just to see what sharedPaymentMode is:", sharedPaymentMode);
//   const paymentMode =
//     sharedPaymentMode === "transferMoney" || sharedPaymentMode === "Gift"
//       ? "send"
//       : "request";

//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <>
//           Enter the amount you want to {paymentMode} in {sharedEstimateAsset}{" "}
//           value
//           <br />
//           <br />
//           NOTE:
//           <b> {rangeMessage}</b>
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </>
//       ),
//       timestamp: new Date(),
//     },
//   ];

//   addChatMessages(newMessages);
// };
// // ALLOW USER ENTER BANK SEARCH CRITERIAL
// export const displaySearchBank = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Enter the first three letters of your Bank name.
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
//   console.log("Next is selectBank");
//   nextStep("selectBank");
//   addChatMessages(newMessages);
// };

// // SHOWS USER BANK DATA IN A LIST TO SELECT FROM
// export const displaySelectBank = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   bankList: string[],
//   setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>
// ) => {
//   const results: Result[] = [];
//   var bankCodes: string[] = [];

//   bankList.forEach((bank) => {
//     const match = bank.match(/^(\d+\.\s.+)\s(\d+)$/);
//     if (match) {
//       results.push({
//         name: match[1],
//         code: match[2],
//       });
//     }
//   });

//   if (results.length === 0) {
//     const retryMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: "No banks matched your input. Please try again:",
//         timestamp: new Date(),
//       },
//     ];
//     addChatMessages(retryMessages);

//     return;
//   }

//   const bankOptions = results.map((result, index) => (
//     <span key={index}>
//       {result.name}
//       <br />
//     </span>
//   ));

//   results.map((result, index) => {
//     bankCodes.push(results[index].code);
//   });

//   setSharedBankCodes(bankCodes);
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: "Enter the number of your bank:",
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: <>{bankOptions}</>,
//       timestamp: new Date(),
//     },
//   ];
//   console.log("Next is enterAccountNumber");
//   nextStep("enterAccountNumber");
//   addChatMessages(newMessages);
// };

// // ALLOW USER TO ENTER BANK NUMBER
// export const displayEnterAccountNumber = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   input: string,
//   sharedBankCode: string[],
//   setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>,
//   sharedBankName: string[],
//   setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>
// ) => {
//   if (input.trim() !== "0") {
//     console.log("The length of sharedBankCode is: ", sharedBankCode.length);
//     var parsedInput = parseInt(input.trim());

//     // Check if the parsed input is within the valid range
//     if (parsedInput > 0 && parsedInput <= sharedBankCode.length) {
//       console.log("Bank code is: ", sharedBankCode[parsedInput - 1]);
//       console.log("Bank name is: ", sharedBankName[parsedInput - 1]);
//       setSharedSelectedBankName(sharedBankName[parsedInput - 1]);
//       setSharedSelectedBankCode(sharedBankCode[parsedInput - 1]);
//     } else {
//       // The selected bank is not in the list
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: <span>Please make sure you choose from the list</span>,
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//   } else {
//     // The selected bank is not in the list
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: <span>Please make sure you choose from the list</span>,
//         timestamp: new Date(),
//       },
//     ];
//     addChatMessages(newMessages);
//     return;
//   }

//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Enter the account number you'd like to receive the payment
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
//   console.log("Next is continueToPay");
//   nextStep("continueToPay");
//   addChatMessages(newMessages);
// };

// // CHECK FOR ACCOUNT DETAILS AND ALLOW USER TO CONTINUE TO PAY
// export const displayContinueToPay = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   name: string,
//   bank_name: string,
//   account_number: string,
//   sharedPaymentMode: string
// ) => {
//   let isGift = sharedPaymentMode.toLowerCase() !== "gift";

//   const newMessages: MessageType[] = [];

//   if (isGift) {
//     newMessages.push({
//       type: "incoming",
//       content: (
//         <span>
//           Name: {name}
//           <br />
//           Bank name: {bank_name}
//           <br />
//           Account number: {account_number}
//         </span>
//       ),
//       timestamp: new Date(),
//     });
//   }

//   newMessages.push({
//     type: "incoming",
//     content: (
//       <span>
//         Here is your menu:
//         <br />
//         <br />
//         1. Continue
//         <br />
//         0. Go back
//         <br />
//         00. Exit
//       </span>
//     ),
//     timestamp: new Date(),
//   });

//   console.log("Next is enterPhone");
//   nextStep("enterPhone");
//   addChatMessages(newMessages);
// };

// // DISPLAY PHONE NUMBER
// export const displayEnterPhone = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ): void => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Please enter Phone Number.
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

//   console.log("Next is sendPayment");
//   nextStep("sendPayment");
//   addChatMessages(newMessages);
// };

// // FINAL PAGE IN THE PAYMENT, USER GET PAYMENT WALLET ADDRESS
// export const displaySendPayment = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   wallet: string,
//   sharedCrypto: string,
//   sharedPaymentAssetEstimate: string,
//   sharedPaymentNairaEstimate: string,
//   transactionID: number,
//   sharedNetwork: string,
//   sharedPaymentMode: string,
//   connectedWallet: boolean,
//   giftID?: number,
//   requestID?: number,
//   lastAssignedTime?: Date
// ) => {
//   const allowedTime = 5;
//   const assetPayment = parseFloat(sharedPaymentAssetEstimate);
//   const paymentAsset = `${assetPayment.toFixed(8)} ${sharedCrypto}`;
//   const isGift = sharedPaymentMode.toLowerCase() === "gift";
//   const isRequest = sharedPaymentMode.toLowerCase() === "request";
//   const isRequestPayment = sharedPaymentMode.toLowerCase() === "payrequest";

//   const copyableTransactionID = (
//     <>
//       Tap to copy Transaction ID 👇🏾 : {transactionID.toString()}
//       <CopyableText
//         text={transactionID.toString()}
//         label={"Transaction ID"}
//         addChatMessages={addChatMessages}
//         nextStep={nextStep}
//         lastAssignedTime={lastAssignedTime}
//       />
//     </>
//   );

//   const copyableGiftID = isGift ? (
//     <>
//       Tap to copy Gift ID 👇🏾 : {giftID?.toString()}
//       <CopyableText
//         text={giftID?.toString() || ""}
//         label={"Gift ID"}
//         addChatMessages={addChatMessages}
//         nextStep={nextStep}
//         lastAssignedTime={lastAssignedTime}
//       />
//     </>
//   ) : null;

//   const copyableRequestID = isRequest ? (
//     <>
//       Tap to copy Request ID 👇🏾 : {requestID?.toString()}
//       <CopyableText
//         text={requestID?.toString() || ""}
//         label={"Request ID"}
//         addChatMessages={addChatMessages}
//         nextStep={nextStep}
//         lastAssignedTime={lastAssignedTime}
//       />
//     </>
//   ) : null;

//   const copyableWalletddress = (
//     <>
//       Tap to copy 👇🏾:
//       <br />
//       <CopyableText
//         text={wallet}
//         label={"Wallet Address"}
//         isWallet={true}
//         addChatMessages={addChatMessages}
//         nextStep={nextStep}
//         lastAssignedTime={lastAssignedTime}
//       />
//     </>
//   );

//   // helper function to generate transaction message
//   const generateTransactionMessage = (extraContent?: ReactNode) => {
//     return isRequest ? (
//       <span>
//         You will recieve{" "}
//         <b>{formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}</b>.
//         <br />
//         {extraContent}
//         <br />
//         Disclaimer: You would get your payment as soon as your request is
//         fulfilled
//         <br />
//       </span>
//     ) : !connectedWallet ? (
//       <>
//         Note: You are sending{" "}
//         <b>
//           {paymentAsset} =
//           {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}
//         </b>{" "}
//         only to 2Settle wallet address to complete your transaction
//         <CopyableText
//           text={assetPayment.toFixed(8)}
//           label={`${sharedCrypto} amount`}
//           addChatMessages={addChatMessages}
//           nextStep={nextStep}
//           lastAssignedTime={lastAssignedTime}
//         />
//         {copyableWalletddress}
//         <span>
//           This wallet address expires in{" "}
//           <b>{allowedTime.toString()} minutes </b>
//         </span>
//       </>
//     ) : (
//       <span>
//         <b>
//           {paymentAsset} ={""}
//           {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}
//         </b>{" "}
//         will be deducted from your {sharedCrypto} ({sharedNetwork}) wallet.
//         <br />
//         {extraContent}
//         <br />
//         Disclaimer: The estimated amount <b>{paymentAsset}</b> does not include{" "}
//         {sharedCrypto} ({sharedNetwork}) transaction fee.
//         {isGift
//           ? `This wallet address expires in ${allowedTime.toString()} minutes`
//           : ""}
//         <br />
//       </span>
//     );
//   };
//   // Define initial message
//   /**
//    * isGift - for creating gift
//    * isRquestPayment - for fulfilling a request
//    * isRequest - making a request
//    * last option - for making a regular transtion
//    */
//   const initialMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: "Phone number confirmed",
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: generateTransactionMessage(
//         isGift ? (
//           <>
//             Note: You are sending{" "}
//             <b>
//               {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")} ={" "}
//               {paymentAsset}{" "}
//             </b>{" "}
//             only to 2Settle wallet address
//             <CopyableText
//               text={assetPayment.toFixed(8)}
//               label={`${sharedCrypto} amount`}
//               addChatMessages={addChatMessages}
//               nextStep={nextStep}
//               lastAssignedTime={lastAssignedTime}
//             />
//             {copyableWalletddress}
//             {copyableGiftID}
//           </>
//         ) : isRequestPayment ? (
//           <>
//             Note: You are sending{" "}
//             <b>
//               {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")} ={" "}
//               {paymentAsset}
//             </b>{" "}
//             only to 2Settle wallet address to fulfill the request
//             <CopyableText
//               text={assetPayment.toFixed(8)}
//               label={`${sharedCrypto} amount`}
//               addChatMessages={addChatMessages}
//               nextStep={nextStep}
//               lastAssignedTime={lastAssignedTime}
//             />
//             {copyableWalletddress}
//             {copyableRequestID}
//           </>
//         ) : isRequest ? (
//           <>
//             Note: You are Requesting for payment of
//             <b>{formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}</b>
//             <br />
//             {copyableRequestID}
//           </>
//         ) : (
//           <>Tap to copy 👇🏾: {copyableTransactionID}</>
//         )
//       ),
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: connectedWallet
//         ? "Thank you for transacting with me"
//         : "Wait for  the pop-up. If missed, say 'hi' to restart.",
//       timestamp: new Date(),
//     },
//   ];

//   addChatMessages(initialMessages);
// };

// export const displayConfirmPayment = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   {
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Your transaction is processing, you'll get your credit soon.
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Thank you for transaction with me, <br />
//             Wait a little while and check if you have received your funds.
//             <br />
//             <br />
//             1. Start another transaction
//             <br />
//             2. No, I want to complain
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];
//     console.log("Next is paymentProcessing");

//     nextStep("paymentProcessing");
//     addChatMessages(newMessages);
//   }
// };

// // DISPLAY HOW TO PROCESS THE TRANSACTION
// export const displayTransactionProcessing = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ): void => {
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Your transaction is processing, you'll get your credit soon.
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Thank you for transaction with me, <br />
//           Wait a little while and check if you have received your recieved your
//           funds.
//           <br />
//           <br />
//           1. Start another transaction
//           <br />
//           2. No, I want to complain
//         </span>
//       ),
//       timestamp: new Date(),
//     },
//   ];

//   console.log("Next is start");
//   nextStep("start");
//   addChatMessages(newMessages);
// };

// // DISPLAY USSER CHARGE
// export const displayCharge = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   input: string,
//   sharedEstimateAsset: string,
//   sharedRate: string,
//   sharedAssetPrice: string,
//   sharedCrypto: string,
//   setSharedCharge: React.Dispatch<React.SetStateAction<string>>,
//   setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>,
//   setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>,
//   setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>,
//   setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>,
//   sharedPaymentMode: string
// ) => {
//   const updateTransactionState = (updates: {
//     charge: string;
//     paymentAssetEstimate: string;
//     paymentNairaEstimate: string;
//     nairaCharge: string;
//     chargeForDB: string;
//   }) => {
//     setSharedCharge(updates.charge);
//     setSharedPaymentAssetEstimate(updates.paymentAssetEstimate);
//     setSharedPaymentNairaEstimate(updates.paymentNairaEstimate);
//     setSharedNairaCharge(updates.nairaCharge);
//     setSharedChargeForDB(updates.chargeForDB);
//   };

//   const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
//   const dollar = ["usdt"];
//   const isCrypto = cryptocurrencies.includes(sharedEstimateAsset.toLowerCase());
//   const isDollar = dollar.includes(sharedEstimateAsset.toLowerCase());
//   const rate = parseFloat(sharedRate);
//   const upperDollar = 2000000 / rate;
//   const lowerDollar = 20000 / rate;
//   const assetPrice = parseFloat(sharedAssetPrice.trim().replace(/[^\d.]/g, ""));
//   const parsedInput = input.trim().replace(/[^\d.]/g, "");
//   // Validate the values
//   if (isNaN(rate) || isNaN(assetPrice) || isNaN(parseFloat(parsedInput))) {
//     console.error("Invalid values:", { rate, assetPrice, input });
//     addChatMessages([
//       {
//         type: "incoming",
//         content: "There was an issue calculating your payment",
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Please retry the transaction again
//             <br /> Contact support if the issue persists.
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//     return;
//   }

//   const dollarValue = parseFloat(parsedInput) * rate;
//   const cryptoValue = parseFloat(parsedInput) * assetPrice * rate;
//   let charge = 0;

//   let max: number;
//   let min: number;

//   const errorMsg =
//     " Invalid amount, try again with an amount within the specified range";

//   /**
//    * Remember charges include
//    * - input < NGN 100,000 = NGN 500
//    * - NGN 100,000 < input > NGN 1,000,000 = NGN 1,000
//    * - input > 1,000,000 == NGN 1,500
//    */
//   if (sharedCrypto.toLowerCase() === "usdt") {
//     if (sharedEstimateAsset.toLowerCase() === "naira") {
//       max = 2_000_000;
//       min = 20_000;
//       const nairaValue = parseFloat(parsedInput);
//       if (nairaValue <= max && nairaValue >= min) {
//         var basic = 500 / rate;
//         var median = 1_000 / rate;
//         var premium = 1_500 / rate;

//         charge =
//           nairaValue <= 100_000
//             ? 500
//             : nairaValue > 100_000 && nairaValue <= 1_000_000
//             ? 1_000
//             : 1_500;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1_000
//             ? median
//             : charge === 1_500
//             ? premium
//             : 0;
//         const cryptoPaymentEstimate = parseFloat(parsedInput) / rate; // this is the asset the user is paying, without charge

//         // Use it like this
//         updateTransactionState({
//           charge: cryptoCharge.toString(),
//           paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//           paymentNairaEstimate: parsedInput,
//           nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//           chargeForDB: `${formatCurrency(
//             cryptoPaymentEstimate.toString(),
//             "USD",
//             "en-NG"
//           )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`,
//         });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9), "USD")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     } else if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
//       max = upperDollar;
//       min = lowerDollar;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           dollarValue <= 100_000
//             ? 500
//             : dollarValue > 100_000 && dollarValue <= 1_000_000
//             ? 1_000
//             : 1_500;

//         var basic = 500 / rate;
//         var median = 1_000 / rate;
//         var premium = 1_500 / rate;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1_000
//             ? median
//             : charge === 1_500
//             ? premium
//             : 0;
//         const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge

//         // SET ALL THE STATE VARIABLES
//         updateTransactionState({
//           charge: cryptoCharge.toString(),
//           paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//           paymentNairaEstimate: nairaPaymentEstimate.toString(),
//           nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//           chargeForDB: `${formatCurrency(
//             cryptoPaymentEstimate.toString(),
//             "USD",
//             "en-NG"
//           )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`,
//         });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9).toString(), "USD")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Invalid amount, try again within range
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     } else {
//       max = upperDollar / rate;
//       min = lowerDollar / rate;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           cryptoValue <= 100000
//             ? 500
//             : cryptoValue > 100000 && cryptoValue <= 1000000
//             ? 1000
//             : 1500;

//         var basic = 500 / rate;
//         var median = 1000 / rate;
//         var premium = 1500 / rate;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//             ? median
//             : charge === 1500
//             ? premium
//             : 0;

//         setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
//         const cryptoPaymentEstimate = parseFloat(parsedInput) / assetPrice; // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate =
//           parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
//         setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
//         setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
//         setSharedNairaCharge(
//           `${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         );
//         // setSharedNairaCharge(charge.toString()); // this is the charge in naira
//         setSharedChargeForDB(
//           `${formatCurrency(
//             cryptoPaymentEstimate.toString(),
//             "USD",
//             "en-NG"
//           )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         );

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9), "NGN", "en-NG")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Invalid amount, try again within range
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     }
//   } else {
//     if (sharedEstimateAsset.toLowerCase() === "naira") {
//       max = 2000000;
//       min = 20000;
//       const nairaValue = parseFloat(parsedInput);
//       if (nairaValue <= max && nairaValue >= min) {
//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;

//         charge =
//           nairaValue <= 100000
//             ? 500
//             : nairaValue > 100000 && nairaValue <= 1000000
//             ? 1000
//             : 1500;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//             ? median
//             : charge === 1500
//             ? premium
//             : 0;
//         const cryptoPaymentEstimate =
//           parseFloat(parsedInput) / rate / assetPrice; // this is the asset the user is paying, without charge

//         // SET ALL THE STATE VARIABLES
//         updateTransactionState({
//           charge: cryptoCharge.toString(),
//           paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//           paymentNairaEstimate: parsedInput,
//           nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//           chargeForDB: `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
//             charge.toString(),
//             "NGN",
//             "en-NG"
//           )}`,
//         });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {sharedCrypto} =
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         sharedPaymentMode.toLowerCase() === "gift"
//           ? nextStep("enterPhone")
//           : nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     } else if (sharedEstimateAsset.toLowerCase() === "dollar" || isDollar) {
//       max = upperDollar;
//       min = lowerDollar;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           dollarValue <= 100000
//             ? 500
//             : dollarValue > 100000 && dollarValue <= 1000000
//             ? 1000
//             : 1500;

//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//             ? median
//             : charge === 1500
//             ? premium
//             : 0;

//         setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
//         const cryptoPaymentEstimate = parseFloat(parsedInput) / assetPrice; // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge
//         setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
//         setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
//         setSharedNairaCharge(
//           `${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         );
//         // setSharedNairaCharge(charge.toString()); // this is the charge in naira
//         setSharedChargeForDB(
//           `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
//             charge.toString(),
//             "NGN",
//             "en-NG"
//           )}`
//         );

//         console.log("crypto charge in dollar", cryptoCharge.toFixed(9));

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {sharedCrypto}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     } else {
//       max = upperDollar / assetPrice;
//       min = lowerDollar / assetPrice;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           cryptoValue <= 100000
//             ? 500
//             : cryptoValue > 100000 && cryptoValue <= 1000000
//             ? 1000
//             : 1500;

//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//             ? median
//             : charge === 1500
//             ? premium
//             : 0;

//         setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
//         const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate =
//           parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
//         setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
//         setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
//         setSharedNairaCharge(
//           `${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         );
//         // setSharedNairaCharge(charge.toString()); // this is the charge in naira
//         setSharedChargeForDB(
//           `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
//             charge.toString(),
//             "NGN",
//             "en-NG"
//           )}`
//         );

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {sharedCrypto} =
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         nextStep("enterBankSearchWord");
//         addChatMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(newMessages);
//         return;
//       }
//     }
//   }
// };
