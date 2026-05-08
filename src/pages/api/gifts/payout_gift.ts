import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    accountNumber,
    accountBank,
    bankName,
    accountName,
    amount,
    narration,
  } = req.body;

  // Log the incoming request body
  // console.log("Request body:", req.body);

  // Check for missing fields and log an error if any are missing
  if (
    !accountNumber ||
    !accountBank ||
    !bankName ||
    !accountName ||
    !narration
  ) {
    console.log("Missing required fields:", {
      accountNumber,
      accountBank,
      bankName,
      accountName,
      amount,
      narration,
    });
    return res.status(400).json({ message: "All fields are required" });
  }
  const mongoroTransferUrl =
    "https://api-biz-dev.mongoro.com/api/v1/openapi/transfer";

  const user = {
    accountNumber,
    accountBank,
    bankName,
    amount,
    saveBeneficiary: false,
    accountName,
    narration: narration,
    currency: "NGN",
    callbackUrl: "http://localhost:3000/payment/success",
    debitCurrency: "NGN",
    pin: process.env.MONGORO_TRANSFERPIN,
  };

  try {
    // Log the user data before sending the request
    console.log("Sending request with correct user data");

    const response = await axios.post(mongoroTransferUrl, user, {
      headers: {
        "Content-Type": "application/json",
        // accessKey: process.env.MONGORO_ACCESS_KEY_API,
        // token: process.env.MONGORO_ACCESS_KEY_API,
        token: process.env.MONGORO_TOKEN,
      },
    });

    // Log the successful response data
    console.log("Response data:", response.data);

    res
      .status(200)
      .json({ message: "Transaction successful", data: response.data });
  } catch (error) {
    console.error("Error occurred during API request:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response from API:", error.response);

        res.status(error.response.status).json({
          message: error.response.data.message || "Error",
          error: error.response.data,
        });
      } else {
        console.error("Network or other error:", error.message);

        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    } else {
      console.error("Non-Axios error:", error);

      res.status(500).json({ message: "Unknown Error", error: String(error) });
    }
  }
}
