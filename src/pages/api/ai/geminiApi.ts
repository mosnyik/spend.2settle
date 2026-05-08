

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  JsonOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { chatPrompt } from "../../../services/ai/ai-endpoint-service";
import { getAvaialableWallet } from "@/services/crypto/wallet";

// import {
//   ChatPromptTemplate,
//   MessagesPlaceholder,
// } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import {
  StructuredOutputParser,
} from "@langchain/core/output_parsers";
// import { OutputFixingParser } from "@langchain/core/output_parsers";
// import { OutputFixingParser } from "@langchain/classic/output_parsers/fix";
import crypto from "crypto";
import {
  createBeneficiary,
  createTransaction,
  fetchCoinPrice,
} from "@/helpers/api_calls";
import { resolveBankAccount } from "@/services/bank/bank.service";
import useRate from "@/hooks/rates/useRate";
import useMerchantRate from "@/hooks/rates/useMerchantRate";
import useProfitRate from "@/hooks/rates/useProfitRate";

// at top of the file (outside handler)
type Sess = Record<string, any>;

declare global {
  // eslint-disable-next-line no-var
  var __SESSIONS__: Sess | undefined;
}

const session: Sess = global.__SESSIONS__ ?? (global.__SESSIONS__ = {});

declare global {
  // eslint-disable-next-line no-var
  var __USERACCTDETAIL__: Sess | undefined;
}

const userAcctDetail: Sess =
  global.__USERACCTDETAIL__ ?? (global.__USERACCTDETAIL__ = {});

// 🧠 Keep userHistories persistent across API calls in Next.js

declare global {
  // eslint-disable-next-line no-var
  var __USER_HISTORIES__: Map<string, any> | undefined;
}

// Reuse the same Map across reloads or create it once
const userHistories =
  global.__USER_HISTORIES__ ?? (global.__USER_HISTORIES__ = new Map());

dotenv.config();

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.0-flash",
//   temperature: 0,
// });

const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "google/gemini-2.0-flash-lite-001",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// const model = new ChatGoogleGenerativeAI({
//   model: "gpt-4o-mini",
//   temperature: 0,
// });

async function extractIntentEntity(phrase: string) {

  
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a data extraction engine.

RULES (VERY IMPORTANT):
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT wrap the output in markdown
- Do NOT add explanations
- Do NOT omit any fields
- If a value is missing, use an empty string "" instead of null
- Use strings only 

Schema:
{format_instructions}

User input:
"{phrase}"
`);


 

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    bank_name:
      "the bank_name is the bank name in nigeria including micro-finance banks e.g(Access bank, opay) and also when user shorten the name make sure you write the full name or empty string ''",
    crypto:
      "the  crypto_asset is the crypto token that the user is using to pay e.g(bitcoin) and make it all in CAPITAL LETTER or empty string ''",
    network:
      "network is the network of the crypto if a user choose BTC the network is BTC, ETH is ETH, BNB is BNB while TRON is TRC20 and USDT Can be erc20, trc20 and bep20. automatically update it base on what the cypto or empty string ''",
    estimation:
      "estimation is how user will like to estimate their money either dollar, naira , crypto and also the user can input maybe dollar, naira , crypt or empty string ''",
    Amount:
      "the Amount the user to send just the numeric e.g $100 or empty string ''",
    acct_number:
      "the account number is nigeria  bank account number it is a ten digit number e.g 7035194443. or empty string ''",
    receiver_phoneNumber:
      "the phone number is nigeria phone number 11 digit number e.g 07035194443 or empty string ''",
    name: "the name of the person it can be any tribe name or english name e.g (olawale,maxwell,john) detect any name provided by the user or empty string ''",
    gift_id:
      "the gift id is a 6 digit number that a user will use to claim gift or empty string ''",
  });

  const chain = prompt.pipe(model).pipe(outputParser);

 try {
   return await chain.invoke({
     phrase,
     format_instructions: outputParser.getFormatInstructions(),
   });
 } catch (error) {
   console.error("Extraction failed:", error);

   // Fallback: return empty structured object
   return {
     bank_name: null,
     crypto: null,
     network: null,
     estimation: null,
     Amount: null,
     acct_number: null,
     receiver_phoneNumber: null,
     name: null,
     gift_id: null,
   };
 }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST allowed" });

    const { messageText, chatId } = req.body;
    console.log("the message.......", messageText)
    console.log("the chatId.......", chatId);
  // check for chatid
   if (!chatId)
     return res.status(400).json({ message: "ChatId must be included" });
  // check for message length
   if (!messageText)
     return res.status(400).json({ message: "Message must be included" });
  // valid chatid

  if (!session[chatId]) {
    session[chatId] = {};
  }

  if (!userAcctDetail[chatId]) {
    userAcctDetail[chatId] = {};
  }
  try {

    console.log("chatId", chatId);
    // Ensure user history exists
    if (!userHistories.has(chatId)) {
      userHistories.set(chatId, []);
    }

    // Add user message to history
    const history = userHistories.get(chatId);
    history.push(new HumanMessage(messageText));

    // 🧩 Step 1: Extract intent + entity
    const intentData = await extractIntentEntity(messageText);
    // ✅ Remove keys that are null or empty
    const filtered = Object.fromEntries(
      Object.entries(intentData).filter(
        ([_, value]) => value !== "" && value !== "null"
      )
    );

    let updatedSession = { ...session[chatId], ...filtered };

    console.log("Updatedddd session:", updatedSession);
    if (updatedSession.crypto === "BTC") {
      updatedSession.network = "BTC";
    } else if (updatedSession.crypto === "ETH") {
      updatedSession.network = "ETH";
    } else if (updatedSession.crypto === "TRON") {
      updatedSession.network = "TRC20";
    }
    // 4. Auto-fetch info if ready
    if (updatedSession.crypto && !updatedSession.assetPrice) {
      // updatedSession.network;
      updatedSession.assetPrice = await fetchCoinPrice(updatedSession.network);
    } 

    // if (!updatedSession.rate) {
    //  // RATE HOOKS
    //  const { data: rate } = useRate();
    //  const { data: merchantRate } = useMerchantRate();
    //  const { data: profitRate } = useProfitRate();

    //   // updatedSession.merchantRate = await fetchMerchantRate();
    //   // updatedSession.profitRate = await fetchProfitRate();
    //   updatedSession["current_rate"] = rate;
    //   updatedSession["merchant_rate"] = merchantRate;
    //   updatedSession["profit_rate"] = profitRate;
    // } 
    
    if (updatedSession.name) {
      const beneficiaryDate = {
        beneficiary_nickname: updatedSession.name,
        beneficiary_acctNO: userAcctDetail[chatId].acct_number,
        beneficiary_acctName: userAcctDetail[chatId].receiver_name,
        beneficiary_bankName: userAcctDetail[chatId].bank_name,
        beneficiary_phoneNumber: userAcctDetail[chatId].receiver_phoneNumber,
      };
      createBeneficiary(beneficiaryDate);
    }

    if (
      updatedSession.bank_name &&
      updatedSession.acct_number &&
      !updatedSession.receiver_name
    ) {
      const name = await resolveBankAccount(
        updatedSession.bank_name,
        updatedSession.acct_number
      );
      console.log("name", name);
      if (name) updatedSession["receiver_name"] = name;
      userAcctDetail[chatId]["bank_name"] = updatedSession.bank_name;
      userAcctDetail[chatId]["acct_number"] = updatedSession.acct_number;
      userAcctDetail[chatId]["receiver_name"] = updatedSession.receiver_name;
    }

    if (updatedSession.receiver_phoneNumber) {
      const user = {
        type: "transfer",
        fiatAmount: 10000,
        fiatCurrency: "NGN",
        crypto: "USDT",
        network: "trc20",
        payer: {
          chatId: "telegram_123456",
        },
        receiver: {
          bankCode: "044",
          accountNumber: "0123456789",
          accountName: "John Doe",
        },
      };

      //   const lowercase = updatedSession.network.toLowerCase();
      //   userAcctDetail[chatId]["receiver_phoneNumber"] =
      //     updatedSession.receiver_phoneNumber;
      //   const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
      //     lowercase
      //   );
      //   updatedSession["wallet_address"] = activeWallet;
      //   if (updatedSession.estimation === "naira") {
      //     updatedSession["numbersOnly"] = updatedSession.Amount.replace(
      //       /[^0-9.]/g,
      //       ""
      //     );
      //     const parsedValue = parseFloat(updatedSession["numbersOnly"]);
      //     if (!isNaN(parsedValue)) {
      //       if (
      //         updatedSession["numbersOnly"] <= 2000000 &&
      //         updatedSession["numbersOnly"] >= 20000
      //       ) {
      //         updatedSession["amountNum"] = updatedSession["numbersOnly"];
      //         const nairaValue = Number(updatedSession["amountNum"]);
      //         updatedSession["amountString"] = nairaValue.toLocaleString();
      //         if (updatedSession["amountNum"] <= 100000) {
      //           updatedSession["transactionFee"] = 500;
      //         } else if (updatedSession["amountNum"] <= 1000000) {
      //           updatedSession["transactionFee"] = 1000;
      //         } else if (updatedSession["amountNum"] <= 2000000) {
      //           updatedSession["transactionFee"] = 1500;
      //         } else if (updatedSession["amountNum"] >= 2100000) {
      //           updatedSession["transactionFee"] = 2000;
      //         }

      //         updatedSession["amountNum"] =
      //           updatedSession["amountNum"] + updatedSession["transactionFee"];
      //         updatedSession["dollaramount"] =
      //           updatedSession["amountNum"] / updatedSession.rate;
      //         updatedSession["asset"] =
      //           updatedSession["dollaramount"] / updatedSession.assetPrice;
      //         updatedSession["totalcrypto"] = updatedSession["asset"].toFixed(8);
      //         updatedSession["amountNum"] = Number(updatedSession["amountNum"]);
      //         updatedSession["amountString"] =
      //           updatedSession["amountNum"].toLocaleString();
      //         updatedSession["effort"] = updatedSession["amountNum"] * 0.01;
      //       }
      //     }
      //   } else if (updatedSession.estimation === "dollar") {
      //     updatedSession["numbersOnly"] = updatedSession.Amount.replace(
      //       /[^0-9.]/g,
      //       ""
      //     );
      //     updatedSession["amountNum"] = parseFloat(updatedSession["numbersOnly"]);
      //     const less100 = 100000 / updatedSession.rate;
      //     const less1million = 1000000 / updatedSession.rate;
      //     const less2million = 2000000 / updatedSession.rate;
      //     if (updatedSession["amountNum"] <= less100) {
      //       updatedSession["transactionFee"] = 500;
      //     } else if (updatedSession["amountNum"] <= less1million) {
      //       updatedSession["transactionFee"] = 1000;
      //     } else if (updatedSession["amountNum"] <= less2million) {
      //       updatedSession["transactionFee"] = 1500;
      //     }

      //     updatedSession["dollarTransactionFee"] =
      //       updatedSession["transactionFee"] / updatedSession.rate;
      //     updatedSession["nairaAmount"] =
      //       updatedSession["amountNum"] * updatedSession.rate;
      //     updatedSession["dollaramount"] =
      //       updatedSession["amountNum"] + updatedSession["dollarTransactionFee"];
      //     updatedSession["assetNum"] =
      //       updatedSession["dollaramount"] / updatedSession.assetPrice;
      //     updatedSession["totalcrypto"] = updatedSession["assetNum"].toFixed(8);
      //     updatedSession["nairaAmount"] = Number(updatedSession["nairaAmount"]);
      //     updatedSession["amountString"] =
      //       updatedSession["nairaAmount"].toLocaleString();
      //     updatedSession["effort"] = updatedSession["nairaAmount"] * 0.01;
      //   }
    }
   
    const prompt = await chatPrompt(updatedSession);
    // Get AI response
    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);
 
    const response = await chain.invoke({
      word: messageText,
      chat_history: history,
    });
   
//     if (updatedSession.wallet_address) {
//       const currentDate = new Date();
//       const day = currentDate.getDate();
//       const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
//       const year = currentDate.getFullYear(); // Ensure leading zeros for single-digit days and months
//       const formattedDay = day < 10 ? "0" + day : day;
//       const formattedMonth = month < 10 ? "0" + month : month;
//       const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
//       const hours = currentDate.getHours();
//       const minutes = currentDate.getMinutes();
//       const ampm = hours >= 12 ? "PM" : "AM";
//       const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//       const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
//       const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`;
//       session[chatId]["Date"] = formattedTime + " " + formattedDate;

//       const min = 100000; // 6-digit number starting from 100000
//       const max = 999999; // 6-digit number up to 999999
//       const range = max - min + 1;

//       // Generate a random 6-digit number within the specified range
//       session[chatId]["transac_id"] =
//         (crypto.randomBytes(4).readUInt32LE(0) % range) + min;

//       const { ...rest } = session[chatId];
//       session[chatId] = {
//         receiver_amount: `₦${updatedSession["amountString"]}`,
//         crypto_sent: `${updatedSession["totalcrypto"]} ${updatedSession.crypto}`,
//         customer_phoneNumber: `${updatedSession.receiver_phoneNumber}`,
//         wallet_address: `${updatedSession.wallet_address}`,
//         effort: `${updatedSession.effort}`,
//         mode_of_payment: "transferMoney",
//         ...rest,
//       };

//       console.log("All the object that is working", session[chatId]);
//       createTransaction(session[chatId]);
//       updatedSession = {};
// }

    // if (Object.keys(updatedSession).length !== 0) {
    //       session[chatId] = {...session[chatId], ...updatedSession }
    //     }
    session[chatId] = updatedSession;
    // Add AI response to history
    history.push(new AIMessage(response));
    console.log("userHistories", userHistories);
    res.status(200).json({
      reply: response,
    });
  } catch (err: unknown) {
    console.error("Error in /api/openai:", err);
  }
}
