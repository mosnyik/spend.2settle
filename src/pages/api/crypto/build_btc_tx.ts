import axios from "axios";
import * as bitcoin from "bitcoinjs-lib";
import { NextApiRequest, NextApiResponse } from "next";

const NETWORK = bitcoin.networks.bitcoin; // bitcoin.networks.bitcoin;

interface BuildTxRequest {
  senderAddress: string;
  recipient: string;
  amount: number; // amount in satoshi
}

function isSegwitAddress(address: string): boolean {
  return address.startsWith("bc1");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  const { senderAddress, recipient, amount } = req.body as BuildTxRequest;

  if (!senderAddress || !recipient || !amount) {
    console.log("Provided values", { senderAddress, recipient, amount });
    return res.status(400).send({ error: "All fields required" });
  }

  try {
    const { data: utxos } = await axios.get(
      // `https://blockstream.info/testnet/api/address/${senderAddress}/utxo`
      `https://blockstream.info/api/address/${senderAddress}/utxo`
    );

    const psbt = new bitcoin.Psbt({ network: NETWORK });

    let totalInput = 0;
    for (const utxo of utxos) {
      const { txid, vout, value } = utxo;

      if (isSegwitAddress(senderAddress)) {
        // SegWit (bech32)
        psbt.addInput({
          hash: txid,
          index: vout,
          witnessUtxo: {
            script: bitcoin.address.toOutputScript(senderAddress, NETWORK),
            value,
          },
        });
      } else {
        // Legacy or P2SH (requires full raw transaction hex)
        const { data: rawTx } = await axios.get(
          `https://blockstream.info/api/tx/${txid}/hex`
        );

        psbt.addInput({
          hash: txid,
          index: vout,
          nonWitnessUtxo: Buffer.from(rawTx, "hex"),
        });
      }

      // psbt.addInput({
      //   hash: utxo.txid,
      //   index: utxo.vout,
      //   witnessUtxo: {
      //     script: bitcoin.address.toOutputScript(senderAddress, NETWORK),
      //     value: utxo.value,
      //   },
      // });

      // totalInput += utxos.value;
      totalInput += value;

      if (totalInput >= amount + 200) break;
    }

    if (totalInput < amount + 200) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    psbt.addOutput({ address: recipient, value: amount });

    const change = totalInput - amount - 200;

    if (change > 0) {
      psbt.addOutput({ address: senderAddress, value: change });
    }

    return res.status(200).json({ psbt: psbt.toBase64() });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Transaction build failed" });
  }
}
