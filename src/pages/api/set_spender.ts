import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { UnknownRpcError } from "viem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { spender } = req.body;

  const spendAbi =
    //    process.env.SPEND_ABI
    [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Debug",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "allowances",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newSpender",
            type: "address",
          },
        ],
        name: "setNewSpender",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "spender",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_from",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "_to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ];

  const spendContractAddress =
    // process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";   process.env.CONTRACT_ADDRESS,
    "0x8b9Fe0a44feC42598573FD0b7bB23FA7C34e06a2";

  const privateKey =
    "bcb868028115b1f18d2f9e1db1bb7bd40946b7b426565b9fefaaa0d3327ae14d";
  // process.env.NEXT_PUBLIC_PRIVATE_KEY;
  const sepoliaRpcUrl =
    "https://shape-sepolia.g.alchemy.com/v2/07G8GoOdHK1wvRsdieD8eMyomjrqrpPO";
  // "https://sepolia.infura.io/v3/af7468d0f18b4e4e922976ab88098c80";
  //  "wss://sepolia.infura.io/ws/v3/af7468d0f18b4e4e922976ab88098c80";

  try {
    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(
      sepoliaRpcUrl
      //   process.env.NEXT_PUBLIC_RPC_URL
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    // Get contract

    const contract = new ethers.Contract(
      spendContractAddress,
      spendAbi,
      wallet
    );

    // Call setNewSpender function
    const tx = await contract.setNewSpender(spender);

    await tx.wait();

    res.status(200).json({ message: "Spender set successfully" });
  } catch (error) {
    console.log("THERE WAS AN ISSUE SETTING SPENDER");
    // Improved error handling

    console.log("An error occured", error);
    res.status(500).json({ error: error });
  }
}
