import { EthereumAddress } from "@/types/general_types";
import { Web3 } from "web3";
import TronWeb from "tronweb";
import dotenv from "dotenv";
import axios from "axios";
import { WalletAddress } from "@/lib/wallets/types";
import { getChainIdHex } from "@/services/transactionService/cryptoService/cryptoConstants";
dotenv.config();

// SETUP
// Contract address and ABI
const contractAddressUSDTBEP20 = "0x55d398326f99059fF775485246999027B3197955";
const contractUSDTBEP20ABI: any[] = [
  {
    inputs: [],
    payable: false,
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
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "_decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddressUSDTERC20 = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const contractABIUSDTERC20: any[] = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_upgradedAddress", type: "address" }],
    name: "deprecate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "deprecated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_evilUser", type: "address" }],
    name: "addBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "upgradedAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balances",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maximumFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_maker", type: "address" }],
    name: "getBlackListStatus",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowed",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "who", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "newBasisPoints", type: "uint256" },
      { name: "newMaxFee", type: "uint256" },
    ],
    name: "setParams",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "redeem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "basisPointsRate",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "isBlackListed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_clearedUser", type: "address" }],
    name: "removeBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_UINT",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_blackListedUser", type: "address" }],
    name: "destroyBlackFunds",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_initialSupply", type: "uint256" },
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Issue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newAddress", type: "address" }],
    name: "Deprecate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "feeBasisPoints", type: "uint256" },
      { indexed: false, name: "maxFee", type: "uint256" },
    ],
    name: "Params",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_blackListedUser", type: "address" },
      { indexed: false, name: "_balance", type: "uint256" },
    ],
    name: "DestroyedBlackFunds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "AddedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "RemovedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
];

function errorAccounts(network: string) {
  return `No accounts found, please add ${network} account`;
}

function errorNetworkNotAvilable(network: string) {
  return `${network} network is not available, add manually`;
}

export async function spendETH(wallet: EthereumAddress, amount: string) {
  console.log("Sending eth...");
  try {
    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );

      throw new Error(
        "You need a provider like Metamask to complete your transaction"
      );
    }

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    const expectedChainID = 1;
    const expectedChainIDHex = getChainIdHex(expectedChainID);

    // request a user to connect wallet
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      throw new Error("No accounts found. Please connect a wallet.");
    }
    // get the chainID of the connected wallet
    const currentChainID = await web3.eth.getChainId();
    const currentChainIDHex = getChainIdHex(currentChainID);

    // Make sure user is connected to ETH mainnet in prod or sopelia testnet in dev
    if (currentChainIDHex !== expectedChainIDHex) {
      try {
        console.log("Switching to ERC20...");

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: expectedChainIDHex,
            },
          ],
        });
        console.log("Network switched to ERC20");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error message", error);

          // check if error has code
          const rpcError = error as { code?: number };
          if (rpcError.code === 4902) {
            console.log("Network is not available in wallet. Add manually");
            throw new Error("Network is not available, add manually");
          } else if (rpcError.code === 4001) {
            throw new Error("User rejected the network switch");
          } else {
            console.log("Unexpected error occured ", rpcError.code);
          }
          return null;
        } else {
          console.log("Unknow error occured", error);
        }
      }
    }

    const valueInWei = web3.utils.toWei(amount, "ether");

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    // sending plain ETH with no transaction data
    const reciept = await web3.eth
      .sendTransaction({
        from: spender,
        to: wallet,
        value: valueInWei,
      })
      .on("error", (error: Error) => {
        throw new Error(error.message);
      });
    return reciept;
  } catch (error) {
    console.error("Error occured", error);

    if (error instanceof Error) {
      if (error.message.includes("insufficient funds")) {
        throw new Error(" Insufficeint funds to to complete the transaction");
      }
      if (error && typeof error === "object" && "code" in error) {
        const rpcError = error as { code: number; message: string; data?: any };
        if (rpcError.data) {
          console.error("Error data", rpcError.data.message);
          throw new Error(rpcError.data.message);
        }
        if (rpcError.code == -32000) {
          throw new Error("Insufficeint balance to complete transaction");
        } else if (rpcError.code === -32603) {
          throw new Error("Error:", rpcError.data.message || rpcError.message);
        } else {
          console.log("the error is: ", error);
          throw new Error(
            "Unknown Error:",
            rpcError.data.message || rpcError.message
          );
        }
      }
    }

    console.error("Error sending the transaction", error);
    throw new Error("Error sending the transaction");
  }
}

export async function spendBNB(wallet: EthereumAddress, amount: string) {
  try {
    // Know if the user has wallet in their browser
    if (typeof window.ethereum === "undefined") {
      console.error("Metamsk not installed, Install metamsk to continue");
      throw new Error(
        "You need a provider like MetaMask to complete your transaction"
      );
    }

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    const expectedChainID = 56;
    const expectedChainIDHex = getChainIdHex(expectedChainID);

    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found. Please connect a wallet.");
    }

    console.log("From accounts in spendBNB...", accounts);

    const currentChainID = await web3.eth.getChainId();
    const currentChainIDHex = getChainIdHex(currentChainID);

    if (currentChainIDHex !== expectedChainIDHex) {
      console.log("Current chain ID", currentChainID);
      try {
        console.log("Switching to BNB...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: expectedChainIDHex,
            },
          ],
        });
        console.log("Current chain ID", currentChainID);
        console.log("Network switched to BNB");
      } catch (error: unknown) {
        if (error instanceof Error) {
          // structure the error for proper handling
          const rpcError = error as { code?: number };
          if (rpcError.code === 4902) {
            throw new Error("Newtork not avaialable, add manually");
          } else if (rpcError.code === 4001) {
            throw new Error("User rejected network swithing");
          } else {
            console.error("An unknow error occured", rpcError.code);
            throw new Error("An unknow error occured");
          }
        }
      }
    }

    const valueInWei = web3.utils.toWei(amount, "ether");

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    const reciept = await web3.eth
      .sendTransaction({
        from: spender,
        to: wallet,
        value: valueInWei,
      })
      .on("error", (error: Error) => {
        throw new Error(error.message);
      });

    console.log(`We have sent ${amount} BNB`, reciept);
    return reciept;
  } catch (error) {
    // narrow down the error
    if (error && typeof error === "object" && "code" in error) {
      const rpcError = error as { code: number; message: string; data?: any };

      if (rpcError.data) {
        throw new Error(rpcError.data.message);
      }

      if (rpcError.code === -32000) {
        throw new Error("Insufficient balance to comeplete transaction");
      } else if (rpcError.code === -32603) {
        throw new Error("Error:", rpcError.data.message || rpcError.message);
      } else {
        throw new Error(
          "Unknown Error:",
          rpcError.data.message || rpcError.message
        );
      }
    }
    console.error("Errorsending the transaction", error);
  }
  return null;
}

export async function spendERC20(wallet: EthereumAddress, amount: string) {
  try {
    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );
      throw new Error(
        "MetaMask is not installed. Please install it to continue."
      );
    }

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const expectedChainID = 1;
    const expectedChainIDHex = getChainIdHex(expectedChainID);

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      throw new Error("No accounts found. Please connect a wallet.");
    }

    const currentChainID = await web3.eth.getChainId();
    const currentChainIDHex = getChainIdHex(currentChainID);

    // Make sure user is on ERC20 network
    if (currentChainIDHex !== expectedChainIDHex) {
      try {
        console.log("switching to ERC20 network");

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: expectedChainIDHex,
            },
          ],
        });
        console.log("Network switched to ERC20");
      } catch (error: unknown) {
        console.log("Error during network switching", error);
        // check if error has code
        const rpcError = error as { code?: number };
        console.log("error code is:", rpcError.code);
        if (rpcError.code === 4902) {
          console.log("Network is not available in wallet. Add manually");
          throw new Error("Network is not available, add manually");
        } else if (rpcError.code === 4001) {
          throw new Error("User rejected the network switch");
        } else {
          console.log("Unexpected error occured ", rpcError.code);
        }
        return null;
      }
    }

    const valueInSmalestUnit = web3.utils.toWei(amount, "mwei");

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    const USDTERC20Contract = new web3.eth.Contract(
      contractABIUSDTERC20,
      contractAddressUSDTERC20
    );

    const rawGasEstimate = await USDTERC20Contract.methods
      .transfer(wallet, valueInSmalestUnit)
      .estimateGas({ from: spender });

    const gasEstimate = rawGasEstimate.toString();

    const receipt = await USDTERC20Contract.methods
      .transfer(wallet, valueInSmalestUnit)
      .send({ from: spender, gas: gasEstimate });

    return receipt;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const rpcError = error as { code: number; message: string; data?: any };
      console.log("Error while sending USDT", rpcError);
      if (rpcError.data) {
        console.error("Error data", rpcError.data.message);
        throw new Error(rpcError.data.message);
      }
      if (rpcError.code === -32000) {
        throw new Error("Insufficeint balance to complete transaction");
      } else if (rpcError.code === -32603) {
        throw new Error("Error:", rpcError.data.message || rpcError.message);
      } else {
        throw new Error(
          "Unknown Error: " +
            (rpcError.data?.message ||
              rpcError.message ||
              "Something went wrong")
        );
      }
    }
    console.error("Error sending the transaction", error);
    throw new Error("Error sending the transaction");
  }
}
export async function spendBEP20(wallet: EthereumAddress, amount: string) {
  try {
    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );
      throw new Error(
        "MetaMask is not installed. Please install it to continue."
      );
    }

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const expectedChainID = 56;
    const expectedChainIDHex = getChainIdHex(expectedChainID);

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      throw new Error("No accounts found. Please connect a wallet.");
    }

    const currentChainID = await web3.eth.getChainId();
    const currentChainIDHex = getChainIdHex(currentChainID);

    console.log("expectedChainIDHex", expectedChainIDHex);
    console.log("currentChainIDHex", currentChainIDHex);

    // Make sure user is on ERC20 network
    if (currentChainIDHex !== expectedChainIDHex) {
      try {
        console.log("switching to BEP20 network");

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: expectedChainIDHex,
            },
          ],
        });
        console.log("Network switched to BEP20");
      } catch (error: unknown) {
        console.log("Error during network switching", error);
        // check if error has code
        const rpcError = error as { code?: number };
        console.log("error code is:", rpcError.code);
        if (rpcError.code === 4902) {
          console.log("Network is not available in wallet. Add manually");
          throw new Error("Network is not available, add manually");
        } else if (rpcError.code === 4001) {
          throw new Error("User rejected the network switch");
        } else {
          console.log("Unexpected error occured ", rpcError.code);
        }
        return null;
      }
    }

    const valueInSmalestUnit = web3.utils.toWei(amount, "mwei");

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    const USDTBEP20Contract = new web3.eth.Contract(
      contractUSDTBEP20ABI,
      contractAddressUSDTBEP20
    );

    const gasEstimate = await USDTBEP20Contract.methods
      .transfer(wallet, valueInSmalestUnit)
      .estimateGas({ from: spender });
    const receipt = await USDTBEP20Contract.methods
      .transfer(wallet, valueInSmalestUnit)
      .send({ from: spender, gas: gasEstimate.toString() });

    return receipt;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const rpcError = error as { code: number; message: string; data?: any };
      console.log("Error while sending USDT", rpcError);
      if (rpcError.data) {
        console.error("Error data", rpcError.data.message);
        throw new Error(rpcError.data.message);
      }
      if (rpcError.code === -32000) {
        throw new Error("Insufficeint balance to complete transaction");
      } else if (rpcError.code === -32603) {
        throw new Error("Error:", rpcError.data.message || rpcError.message);
      } else {
        throw new Error(
          "Unknown Error:",
          rpcError.data.message || rpcError.message || ""
        );
      }
    }
    console.error("Error sending the transaction", error);
    throw new Error("Error sending the transaction");
  }
}
// utils/btc/sendTx.ts
export async function sendBTC({
  senderAddress,
  recipient,
  amount,
  signPsbtFn,
}: {
  senderAddress: WalletAddress;
  recipient: WalletAddress;
  amount: number;
  signPsbtFn: (base64Psbt: string) => Promise<string>;
}) {
  const SATOSHIS_PER_BTC = 100_000_000;

  const satoshiAmount = Math.round(amount * SATOSHIS_PER_BTC);
  try {
    // 1. Request PSBT from server
    const buildRes = await axios.post("/api/crypto/build_btc_tx", {
      senderAddress,
      recipient,
      amount: satoshiAmount,
    });

    const { psbt } = buildRes.data;
    if (!psbt) throw new Error("Failed to build transaction");
    console.log("Partially Signed Btc Trx", psbt);

    if (typeof signPsbtFn !== "function") {
      throw new Error("Invalid or missing signing function (signPsbtFn)");
    }

    // 2. Ask user wallet to sign PSBT
    const signedPsbt = await signPsbtFn(psbt);
    if (!signedPsbt) throw new Error("User did not sign");
    // 3. Broadcast
    const broadcastRes = await axios.post("/api/broadcast_btc_tx", {
      signedPsbtBase64: signedPsbt,
    });

    const { txid } = broadcastRes.data;
    if (!txid) throw new Error("Broadcast failed: No transaction ID returned");

    return txid;
    // return broadcastRes.data.txid;
  } catch (error: any) {
    const serverMessage = error?.response?.data?.error;
    if (serverMessage === "Insufficient balance") {
      throw new Error("Insufficient balance");
    }
    // Handle network/other specific messages as needed
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    console.error("Error in sendBTC:", error.message);
    throw new Error("Failed to send BTC transaction");
  }
}

export async function spendTRX(wallet: EthereumAddress, amount: string) {
  try {
    // check if user has wallet connected
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      throw new Error("You need to connect TronLink wallet");
    }
    // get the connected wallet address
    const spender = window.tronWeb.defaultAddress.base58;
    // convert the amount to SUN
    const sunAmount = window.tronWeb.toSun(amount);
    const amountInSun = Math.floor(sunAmount);
    //

    // check if the user have enough balance
    const balance = await window.tronWeb.trx.getBalance(spender);
    if (balance < amountInSun) {
      console.log("Insufficient balance for transaction");
      throw new Error("Insufficient balance");
    }
    // create a transaction object
    const transaction = await window.tronWeb.trx.sendTransaction(
      wallet as string,
      amountInSun
    );
    if (transaction?.result) {
      console.log("Transaction successful. TXID:", transaction.txid);
      return transaction;
    } else {
      throw new Error("Transaction broadcast failed");
    }
  } catch (error) {
    // forward the error for the calling function to handle
    throw error;
  }
}

export async function spendTRC20(wallet: EthereumAddress, amount: string) {
  try {
    // Check if user has TronLink connected
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      throw new Error("You need to connect TronLink wallet");
    }

    // Get the connected wallet address
    const sender = window.tronWeb.defaultAddress.base58;

    // Convert amount to token's smallest unit (USDT uses 6 decimals)
    const amountInSun = Math.floor(parseFloat(amount) * 1e6);
    // const tokenContractAddress = "TXLAQ63Xg1NAzckPwKHvzwE7HdRc8Q5hU4";
    const tokenContractAddress = process.env.NEXT_PUBLIC_USDT_TRC20_CONTRACT;

    if (!tokenContractAddress) {
      throw new Error("USDT contract address is not defined");
    }

    // Load the TRC20 contract
    const contract = await window.tronWeb.contract().at(tokenContractAddress);

    // Check if user has enough TRC20 balance
    const balanceRaw = await contract.methods.balanceOf(sender).call();
    const balance = parseFloat(balanceRaw.toString());

    if (balance < amountInSun) {
      console.log("Insufficient token balance for transaction");
      throw new Error("Insufficient token balance");
    }

    // Send tokens
    const transaction = await contract.methods
      .transfer(wallet, amountInSun)
      .send();

    if (transaction) {
      console.log("TRC20 transfer successful. TXID:", transaction);
      return transaction;
    } else {
      throw new Error("TRC20 transfer failed to broadcast");
    }
  } catch (error) {
    // Forward the error for the calling function to handle
    throw error;
  }
}
