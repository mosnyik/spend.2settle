import { formatPhoneNumber } from "@/utils/utilities";
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const {
    phoneNumber,
    transactionAmount,
    bankName,
    accountName,
    accountNumber,
  } = req.body;

  if (
    !phoneNumber ||
    !transactionAmount ||
    !bankName ||
    !accountName ||
    !accountNumber
  ) {
    return res.status(400).json({
      success: false,
      message:
        "All fields (phoneNumber, transactionAmount, transactionId, bankName, accountName, accountNumber) are required",
    });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    return res.status(500).json({
      success: false,
      message: "Twilio credentials are not properly configured",
    });
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: `We have credited ${transactionAmount} to: \nBank Name: ${bankName}, \nAccount Name : ${accountName} \nBank Number :  ${accountNumber} \nFor help or complain, please contact support on 09038880228.`,
      from: "2SettleHQ",
      to: formatPhoneNumber(phoneNumber),
    });

    res.status(200).json({
      success: true,
      message: "Transaction SMS sent successfully",
      messageId: message.sid,
    });
  } catch (error) {
    console.error("Error sending transaction SMS:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send transaction SMS" });
  }
}
