
import { OpenAI } from "openai";
const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.OPENAI_API_KEY!,
});
// export async function extractTransactionData(message: string, verbose = false) {
//   const expectedFields = [
//     "asset",
//     "network",
//     "estimationType",
//     "amount",
//     "bankName",
//     "accountNumber",
//     "chargesMode",
//   ];

//   const prompt = `
// You are a strict data extractor.
// Extract the following fields from the message: asset, network, estimationType (naira, dollar, crypto), amount, bankName, accountNumber, chargesMode.
 
// Strictly return only a valid JSON object like this:
// {
//   "asset": "USDT",
//   "network": "TRC20",
//   "estimationType": "naira",
//   "amount": "20000",
//   "bankName": "Kuda",
//   "accountNumber": "1234567890",
//   "chargesMode": "receiver"
// }

// If any field is not found, set it as null.
// Do not explain anything.
// Only return the JSON.

// Message:
// "${message}"
// `;

//   try {
//     const res = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const raw = res.choices[0].message.content || "{}";

//     // Try to extract JSON object from possible surrounding text
//     const match = raw.match(/{[\s\S]*}/);
//     const jsonString = match ? match[0] : "{}";

//     let parsed: any = JSON.parse(jsonString);

//     // Ensure all fields exist
//     for (const field of expectedFields) {
//       if (!(field in parsed)) parsed[field] = null;
//     }

//     if (verbose) {
//       console.log("Extracted transaction data:", parsed);
//     }

//     return parsed;
//   } catch (err) {
//     console.error("Failed to extract transaction data:", err);
//     return expectedFields.reduce((acc, field) => {
//       acc[field] = null;
//       return acc;
//     }, {} as Record<string, any>);
//   }
// }
 export async function extractTransactionData(
   message: string,
   verbose = false
 ) {
   const expectedFields = [
     "asset",
     "network",
     "estimationType",
     "amount",
     "bankName",
     "accountNumber",
     "chargesMode",
     "phoneNumber",
     "BeneficiaryName"
   ];

   const prompt = `
   
You are a strict data extractor.
Extract the following fields from the message: asset, network, estimationType (naira, dollar, crypto), amount, bankName, accountNumber,.
the bankName is any bank name in nigeria including micro-finance banks all and extract the name of the bank.
the account number is nigeria  bank account number it is a ten digit number e.g 7035194443.
and the phone number is 11 digit number
BeneficiaryName is name of a person
Strictly return only a valid JSON object like this:
{
  "asset": "USDT",
  "network": "TRC20",
  "estimationType": "naira",
  "amount": "20000",
  "bankName": "Kuda",
  "accountNumber": "1234567890",
  "chargesMode": "receiver",
  "phoneNumber":'12345678910'
  "BeneficiaryName": 'Kelvin'
}

If any field is not found, set it as null.
Do not explain anything.
Only return the JSON.

Message:
"${message}"
`;

   try {
     const res = await openai.chat.completions.create({
       model: "gpt-4o",
       messages: [{ role: "user", content: prompt }],
     });

     const raw = res.choices[0].message.content || "{}";
     console.log('from helper function ', raw)
     // Try to extract JSON object from possible surrounding text
     const match = raw.match(/{[\s\S]*}/);
     const jsonString = match ? match[0] : "{}";

     let parsed: any = JSON.parse(jsonString);

     // Ensure all fields exist
     for (const field of expectedFields) {
       if (!(field in parsed)) parsed[field] = null;
     }

     // Auto-set network if asset is known but network is missing
     if (!parsed.network && parsed.asset) {
       const assetUpper = parsed.asset.toUpperCase();
       const assetToNetwork: Record<string, string> = {
         BTC: "BTC",
         ETH: "ETH",
         BNB: "BNB",
         TRON: "TRC20",
       };
       if (assetUpper in assetToNetwork) {
         parsed.network = assetToNetwork[assetUpper];
       }
     }

     if (verbose) {
       console.log("Extracted transaction data:", parsed);
     }

     
// ✅ Remove keys that are null or empty
const filtered = Object.fromEntries(
  Object.entries(parsed).filter(([_, value]) => value !== null && value !== "")
);

return filtered;

   } catch (err) {
     console.error("Failed to extract transaction data:", err);
     return expectedFields.reduce((acc, field) => {
       acc[field] = null;
       return acc;
     }, {} as Record<string, any>);
   }
 }


export function getNextMissingField(session: any): string | null {
  const required = [
    "asset",
    "network",
    "estimationType",
    "amount",
    "chargesMode",
    "bankName",
    "accountNumber",
    "receiverName",
  ]; 
  for (const key of required) {
    if (!session[key]) return key;
  }
  return "summary";
}
