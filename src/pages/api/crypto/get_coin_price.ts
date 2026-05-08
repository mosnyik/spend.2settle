import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getBaseSymbol } from "@/utils/utilities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let { ticker } = req.body;
  ticker = getBaseSymbol(ticker);
  console.log("Received request with symbol:", ticker);

  if (!ticker || typeof ticker !== "string") {
    return res
      .status(400)
      .json({ error: "Ticker is required and must be a string" });
  }

  try {
    console.log(`Fetching data for symbol: ${ticker}`);
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`,
      {
        params: { symbol: ticker },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
      }
    );

    // console.log("Data fetched successfully:", response.data);
    const { price } = response.data.data[ticker].quote.USD;

    // console.log("Data fetched successfully:", price);
    res.status(200).send({ price });
  } catch (error) {
    console.error("Error fetching coin price:", error);
    res.status(500).send("Server error");
  }
}
