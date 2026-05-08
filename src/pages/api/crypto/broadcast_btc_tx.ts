import type { NextApiRequest, NextApiResponse } from "next";
import * as bitcoin from "bitcoinjs-lib";
import axios from "axios";

const NETWORK = bitcoin.networks.bitcoin; // bitcoin.networks.bitcoin;

type BroadcastTxRequest = {
  signedPsbtBase64: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { signedPsbtBase64 } = req.body as BroadcastTxRequest;

  try {
    const psbt = bitcoin.Psbt.fromBase64(signedPsbtBase64, {
      network: NETWORK,
    });

    const tx = psbt.finalizeAllInputs().extractTransaction();
    const rawTxHex = tx.toHex();

    const { data: txid } = await axios.post(
      // "https://blockstream.info/testnet/api/tx",
      "https://blockstream.info/api/tx",
      rawTxHex
    );

    return res.status(200).json({ txid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Broadcast failed", details: error });
  }
}
