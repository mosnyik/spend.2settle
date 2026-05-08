// import { NextApiRequest, NextApiResponse } from "next";
// import crypto from "crypto";
// import { OpenAI } from "openai";
// import {
//   createTransaction,
//   fetchCoinPrice,
//   // fetchMerchantRate,
//   // fetchProfitRate,
//   // fetchRate,
//   getAvaialableWallet,
//   resolveBankAccount,
// } from "@/helpers/api_calls";
// import { extractTransactionData, getNextMissingField } from "@/lib/nlpHelpers";
// import { calculateCryptoAmount } from "@/utils/menuUtils/transactCryptoUtils";
// import { sessionStore } from "@/lib/sessionStore";

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
// import { HumanMessage, AIMessage } from "@langchain/core/messages";
// import { StringOutputParser } from '@langchain/core/output_parsers';

// // at top of the file (outside handler)
// type Sess = Record<string, any>;

// declare global {
//   // eslint-disable-next-line no-var
//   var __SESSIONS__: Sess | undefined;
// }

// const session: Sess = global.__SESSIONS__ ?? (global.__SESSIONS__ = {});

// const openai = new OpenAI({
//   baseURL: "https://models.github.ai/inference",
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.0-flash",
//   temperature: 0
// });
// //let session: { [key: string]: any } = {}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST")
//     return res.status(405).json({ message: "Only POST allowed" });

//   const { messages, sessionId } = req.body;

//  const userHistories = new Map();
  

//     if (!userHistories.has(sessionId)) {
//     userHistories.set(sessionId, []);
//     }
  
  
  
//   if (!session[sessionId]) {
//     session[sessionId] = {};
//   }

//   console.log('session...', session)
//   console.log('sessionId', sessionId)
//   // 2. Extract info from latest user message using GPT
//   const extracted = await extractTransactionData(
//     messages[messages.length - 1].content
//   );

//   // 3. Update session
//   const updatedSession = { ...session[sessionId], ...extracted };
//   console.log("Updatedddd session:", updatedSession)
  
//   if (
//     updatedSession.bankName &&
//     updatedSession.accountNumber &&
//     !updatedSession.receiver_name
//   ) {
//     const name = await resolveBankAccount(
//       updatedSession.bankName,
//       updatedSession.accountNumber
//     );
//     if (name) updatedSession['receiver_name'] = name;
//   }

// // if (updatedSession.accountNumber && updatedSession.network) {
// //   const lowercase = updatedSession.network.toLowerCase();
// //   getAvaialableWallet(lowercase).then(({ activeWallet }) => {
// //     updatedSession.activeWallet = activeWallet;
// //     session[sessionId] = updatedSession;
// //   }).catch(console.error);
// //   }
  
  
//   if (updatedSession.phoneNumber) {
//     const lowercase = updatedSession.network.toLowerCase();
//     const { activeWallet, lastAssignedTime } = await getAvaialableWallet(lowercase);
//     updatedSession['activeWallet'] = activeWallet;
//     if (updatedSession.estimationType === 'naira') {
//       updatedSession['numbersOnly'] = updatedSession.amount.replace(/[^0-9.]/g, '');
//       const parsedValue = parseFloat(updatedSession['numbersOnly']);
//       if (!isNaN(parsedValue)) {
//         if (updatedSession['numbersOnly'] <= 2000000 && updatedSession['numbersOnly'] >= 20000) {
//           updatedSession['amountNum'] = updatedSession['numbersOnly'];
//           const nairaValue = Number(updatedSession['amountNum'])
//           updatedSession['amountString'] = nairaValue.toLocaleString()
//           if (updatedSession['amountNum'] <= 100000) {
//             updatedSession['transactionFee'] = 500;
//           } else if (updatedSession['amountNum'] <= 1000000) {
//             updatedSession['transactionFee'] = 1000;
//           } else if (updatedSession['amountNum'] <= 2000000) {
//             updatedSession['transactionFee'] = 1500;
//           } else if (updatedSession['amountNum'] >= 2100000) {
//             updatedSession['transactionFee'] = 2000;
//           }
             
//           updatedSession['amountNum'] = updatedSession['amountNum'] + updatedSession['transactionFee']
//           updatedSession['dollaramount'] = updatedSession['amountNum'] / updatedSession.rate
//           updatedSession['asset'] = updatedSession['dollaramount'] / updatedSession.assetPrice
//           updatedSession['totalcrypto'] = updatedSession['asset'].toFixed(8)
//           updatedSession['amountNum'] = Number(updatedSession['amountNum'])
//           updatedSession['amountString'] = updatedSession['amountNum'].toLocaleString()
//           updatedSession['effort'] = updatedSession['amountNum'] * 0.01;
          

//         }
//       }
//     } else if (updatedSession.estimationType === 'dollar') {
//       updatedSession['numbersOnly'] = updatedSession.amount.replace(/[^0-9.]/g, '');
//       updatedSession['amountNum'] = parseFloat(updatedSession['numbersOnly']);
//       const less100 = 100000 / updatedSession.rate
//       const less1million = 1000000 / updatedSession.rate
//       const less2million = 2000000 / updatedSession.rate
//       if (updatedSession['amountNum'] <= less100) {
//         updatedSession['transactionFee'] = 500;
//       } else if (updatedSession['amountNum'] <= less1million) {
//         updatedSession['transactionFee'] = 1000;
//       } else if (updatedSession['amountNum'] <= less2million) {
//         updatedSession['transactionFee'] = 1500;
//       }
       
//       updatedSession['dollarTransactionFee'] = updatedSession['transactionFee'] / updatedSession.rate
//       updatedSession['nairaAmount'] = updatedSession['amountNum'] * updatedSession.rate
//       updatedSession['dollaramount'] = updatedSession['amountNum'] + updatedSession['dollarTransactionFee']
//       updatedSession['assetNum'] = updatedSession['dollaramount'] / updatedSession.assetPrice
//       updatedSession['totalcrypto'] = updatedSession['assetNum'].toFixed(8)
//       updatedSession['nairaAmount'] = Number(updatedSession['nairaAmount'])
//       updatedSession['amountString'] = updatedSession['nairaAmount'].toLocaleString()
//       updatedSession['effort'] = updatedSession['nairaAmount'] * 0.01;

//     }
//   }
  
//   if (updatedSession.activeWallet) {
//   const currentDate = new Date();
//   const day = currentDate.getDate();
//   const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
//   const year = currentDate.getFullYear();// Ensure leading zeros for single-digit days and months
//   const formattedDay = day < 10 ? '0' + day : day;
//   const formattedMonth = month < 10 ? '0' + month : month;
//   const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
//   const hours = currentDate.getHours();
//   const minutes = currentDate.getMinutes();
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//   const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
//   const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`;
//   session[sessionId]['Date']  = formattedTime + " " + formattedDate
 
//      const min = 100000; // 6-digit number starting from 100000
//       const max = 999999; // 6-digit number up to 999999
//       const range = max - min + 1;
     
//       // Generate a random 6-digit number within the specified range
//       session[sessionId]['transac_id'] = crypto.randomBytes(4).readUInt32LE(0) % range + min

//     const { asset,estimationType,amount,accountNumber,bankName,phoneNumber,activeWallet,assetPrice,rate, ...rest } = session[sessionId];
//      session[sessionId]= {
//        crypto: asset,
//        estimation: estimationType,
//        Amount: amount,
//        acct_number: accountNumber,
//        bank_name: bankName,
//        receiver_phoneNumber: updatedSession.phoneNumber,
//        wallet_address:  updatedSession['activeWallet'],
//        asset_price: assetPrice,
//        receiver_amount: `₦${updatedSession['amountString']}`,
//        crypto_sent: `${updatedSession['totalcrypto']} ${updatedSession.asset}`,
       
//       ...rest
//     };

//     console.log('All the object that is working', session[sessionId])
//     createTransaction(session[sessionId])
//   }
  
//   try {
//     // 1. Call OpenAI
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful, cheerful and concise Nigerian crypto assistant for 2settle.
//                 You help users convert crypto to naira and send to Nigerian bank accounts.
//                 Never ask about charges, fees, deductions, or service charge in any form.
// .
//                 Collect these details step-by-step (ask one at a time): 

//                 Keep responses short, friendly, and clear. Never ask for more than one detail at a time.
   
// You collect details step-by-step, but SKIP questions if they have already been provided earlier in the conversation or stored in the session.

// Session data so far:'
// - Asset: ${updatedSession.asset}
// - Network: ${updatedSession.network}
// - Estimation Type: ${updatedSession.estimationType}
// - Amount: ${updatedSession.amount}
// - Bank Name: ${updatedSession.bankName}
// - Account Number: ${updatedSession.accountNumber} 
// - phone number: ${updatedSession.phoneNumber} 
// - total crypto: ${updatedSession['totalcrypto']}



// 1. Asset (BTC, ETH, BNB, TRON, USDT)
// 2. Network (only if asset is USDT)
// 3. Estimation type: crypto, naira, or dollar
// 4. Amount
// 5. Bank name
// 6. Account number
// 7. ask if the account details is correctly Name:${updatedSession.receiver_name} Bank name:${updatedSession.bankName} Account number:${updatedSession.accountNumber}
// 8.  phone number
// 9. after phone number then display you are sending ${updatedSession['totalcrypto']} ${updatedSession.asset} to this wallet address ${updatedSession.activeWallet} and you will be receiving ₦${updatedSession['amountString']}.
// 10.this question should follow, would you like to save this person as beneficiary?
// 11. if user say YES. ask the user what name will you like to save the beneficiary with? 
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             =iug
//   If user says they want to send to "mom", "dad", or another person:
// 1. Ask: "What’s your [relation]’s full name?"

//                 If the user gives multiple values, extract what you can, confirm it, and move to the next question.
//                 If the user provides a value but you need another value to compute, extract the value you have,
//                 then ask for the value you need to compute the next one
//                 eg if a user says he wants to send USDT, you need network to get wallet.
//                 If a user choose to use BTC, the network should automatically be BTC and like that, only exception is USDT.
//               `
//           ,
//         },
//         ...messages,
//       ],
//     });

//     const reply = aiResponse.choices[0].message.content || "";

   
//     // 4. Auto-fetch info if ready
//     if (updatedSession.asset && !updatedSession.assetPrice) {
//       // updatedSession.network;
//       console.log("Updated session:", updatedSession)
//       updatedSession.assetPrice = await fetchCoinPrice(updatedSession.network);
//     }

//     if (!updatedSession.rate) {
//       updatedSession.rate = await fetchRate();
//       updatedSession.merchantRate = await fetchMerchantRate();
//       updatedSession.profitRate = await fetchProfitRate();
//       updatedSession['current_rate'] = `₦${updatedSession['rate'].toLocaleString()}`
//       updatedSession['merchant_rate'] = `₦${updatedSession['merchantRate'].toLocaleString()}`
//       updatedSession['profit_rate'] = `₦${updatedSession['profitRate'].toLocaleString()}`
//     }

//     // if (
//     //   updatedSession.bankName &&
//     //   updatedSession.accountNumber &&
//     //   !updatedSession.receiverName
//     // ) {
//     //   const name = await resolveBankAccount(
//     //     updatedSession.bankName,
//     //     updatedSession.accountNumber
//     //   );   
//     //   if (name) updatedSession['receiverName'] = name;
//     // }

//     // 5. Check what is still missing
//     const missingField = getNextMissingField(updatedSession);

//     // 6. Prompt accordingly
//     let followUp = "";
//     if (missingField === "bankName")
//       followUp = "Which bank are you sending to?";
//     else if (missingField === "accountNumber")
//       followUp = "Please enter the recipient’s account number.";
//     else if (missingField === "confirmBank") {
//       followUp = `You're sending to ${updatedSession.receiverName} – ${updatedSession.bankName} (${updatedSession.accountNumber}). Confirm?`;
//     } else if (missingField === "summary") {
//       const cryptoAmount = calculateCryptoAmount(updatedSession);
//       followUp = `You're about to send NGN ${updatedSession.naira} to ${updatedSession.receiverName} (${updatedSession.bankName} - ${updatedSession.accountNumber}) using ${cryptoAmount} ${updatedSession.asset}. Should I generate a payment wallet?`;
//     }

//     // 7. Save session
//     // sessionStore.set(sessionId, updatedSession);
//     session[sessionId] = updatedSession

//     console.log('the updated sessionss....', session[sessionId])
//     res.status(200).json({
//       reply: reply + "\n\n" + followUp,
//       session: updatedSession,
//     });
//   } catch (err: unknown) {
//     console.error("Error in /api/openai:", err);

//     if (typeof err === "object" && err !== null && "response" in err) {
//       const error = err as any; // or use AxiosError if you imported it

//       if (error.response.status === 400) {
//         res.status(400).json({ error: "Bad request. Please check the input." });
//       } else if (error.response.status === 401) {
//         res.status(401).json({ error: "Unauthorized. Check your API key." });
//       } else if (error.response.status === 429) {
//         res.status(429).json({ error: "Rate limit exceeded. Please slow down and try again." });
//       } else if (error.response.status === 503) {
//         let waitTime = "a few";

//         if (error.response?.data?.message) {
//           const match = error.response.data.message.match(/\d+/);
//           if (match) {
//             waitTime = match[0];
//           }
//         }

//         res.status(503).json({
//           error: `Ops!! you will have to wait a little longer. Please try again in ${waitTime} seconds.`,
//         });
//       } else {
//         res.status(error.response.status).json({
//           error: error.response.data?.error?.message || "Something went wrong with the request.",
//         });
//       }
//     } else {
//       res.status(500).json({ error: "Something went wrong" });
//     }
//   }
// }

// // 1. Asset (BTC, ETH, BNB, TRON, USDT)
// // 2. Network (only if asset is USDT)
// // 3. Estimation type: crypto, naira, or dollar (only if the user mention naira or dollar or the amount of the asset)
// // 4. Amount
// // 5. Bank name
// // 6. Account number




// // 1. Asset (BTC, ETH, BNB, TRON, USDT)
// //    - Always ask for the asset unless the user has already mentioned it in their first message.
// //    - Example: If the user says "I want to convert my 2 BNB to naira", you already know the asset is BNB, so skip this step.

  
// // 2. Network (only if asset is USDT)
// //    - Ask for the network ONLY if the asset is USDT.
// //    - If the asset is not USDT, skip this step.

// //   Step 3: Estimation type (crypto, naira, or dollar)

// // Normally ask: "How do you want to estimate your transaction? (crypto, naira, or dollar)".

// // Skip asking   if the user already mentioned both amount and its type:

// // “I want to convert 2 BNB” → estimation type = crypto.

// // “I want to send 20k naira” → estimation type = naira.

// // “I want to send 50 dollars” → estimation type = dollar.

// // The AI should detect intent even if the wording is different (e.g., “convert my 2 BTC”, “send twenty thousand”, “give me cash for $50”).

// // Step 4: Amount

// // If the amount is not given earlier, ask for it.

// // If the amount is already given, confirm it before moving forward.

// // Step 5: Bank name
// // Step 6: Account number
