import { describe, it, expect, vi, beforeEach } from "vitest";

type BalanceType = Record<string, bigint>;
vi.mock("web3", () => {
  const balances: BalanceType = {
    "0xmosnyik": BigInt(1000),
    "0xanotherwallet": BigInt(100),
  };

  const allowances: BalanceType = {};

  const makeKey = (owner: string, spender: string) => `${owner}_${spender}`;

  const mockContract = {
    methods: {
      balanceOf: vi.fn((address: string) => ({
        call: vi.fn().mockResolvedValue(balances[address] || BigInt(0)),
      })),

      transfer: vi.fn((to: string, amount: bigint) => ({
        send: vi.fn(async ({ from }: { from: string }) => {
          if (!balances[from] || balances[from] < amount) {
            throw new Error("Insufficient balance");
          }

          balances[from] -= amount;
          balances[to] = (balances[to] || BigInt(0)) + amount;

          return { status: true, from, to, transactionHash: "0x123" };
        }),
      })),

      approve: vi.fn((spender: string, amount: bigint) => ({
        send: vi.fn(async ({ from }: { from: string }) => {
          allowances[makeKey(from, spender)] = amount;
          return { status: true, from, spender, transactionHash: "0x456" };
        }),
      })),

      allowance: vi.fn((owner: string, spender: string) => ({
        call: vi.fn(
          async () => allowances[makeKey(owner, spender)] ?? BigInt(0)
        ),
      })),

      transferFrom: vi.fn((from: string, to: string, amount: bigint) => ({
        send: vi.fn(async ({ from: caller }: { from: string }) => {
          const key = makeKey(from, to);
          if ((allowances[key] || 0) < amount) {
            throw new Error("Allowance exceeded");
          }
          if (!balances[from] || balances[from] < amount) {
            throw new Error("Insufficient balance");
          }
          balances[from] -= amount;
          balances[to] = (balances[to] || BigInt(0)) + amount;
          allowances[key] -= amount;

          return {
            status: true,
            from,
            to,
            caller,
            amount,
            transactionHash: "0x789",
          };
        }),
      })),
    },
  };

  const Web3Mock = vi.fn().mockImplementation(() => ({
    eth: {
      Contract: vi.fn().mockImplementation(() => mockContract),
    },
    utils: {
      toWei: vi.fn((val) => val.toString()), // mock toWei for tests
    },
  }));

  return {
    default: Web3Mock,
    Web3: Web3Mock,
  };
});

import Web3 from "web3";
import { spendBEP20 } from "../bep20Service";

describe("Test USDT setup", () => {
  let web3: any;
  let usdt: any;

  beforeEach(() => {
    web3 = new Web3("https://mock-chain.local");
    usdt = new web3.eth.Contract([], "0xUSDTContractAddress");
  });

  it("should initiate USDT balances", async () => {
    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();

    expect(balance1).toBe(BigInt(1000));
    expect(balance2).toBe(BigInt(100));
  });

  it("should transfer USDT between wallets", async () => {
    const receipt = await usdt.methods
      .transfer("0xanotherwallet", BigInt(200))
      .send({ from: "0xmosnyik" });

    expect(receipt.status).toBe(true);

    const errorTransfer = await usdt.methods
      .transfer("0xmosnyik", BigInt(2000))
      .send({ from: "0xanotherwallet" })
      .catch((e: Error) => e);
    expect(errorTransfer).toBeInstanceOf(Error);
    expect((errorTransfer as Error).message).toBe("Insufficient balance");

    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();
    expect(balance1).toBe(BigInt(800));
    expect(balance2).toBe(BigInt(300));
  });

  it("should approve and transferFrom USDT", async () => {
    const approveReceipt = await usdt.methods
      .approve("0xspender", BigInt(150))
      .send({ from: "0xmosnyik" });
    expect(approveReceipt.status).toBe(true);

    const allowance = await usdt.methods
      .allowance("0xmosnyik", "0xspender")
      .call();
    expect(allowance).toBe(BigInt(150));
  });

  it("should transferFrom USDT using allowance", async () => {
    // First, approve the allowance
    await usdt.methods
      .approve("0xanotherwallet", BigInt(150))
      .send({ from: "0xmosnyik" });
    const receipt = await usdt.methods
      .transferFrom("0xmosnyik", "0xanotherwallet", BigInt(100))
      .send({ from: "0xanotherwallet" });
    expect(receipt.status).toBe(true);

    const balance1 = await usdt.methods.balanceOf("0xmosnyik").call();
    const balance2 = await usdt.methods.balanceOf("0xanotherwallet").call();
    expect(balance1).toBe(BigInt(700));
    expect(balance2).toBe(BigInt(400));
  });
});

describe("Test usdt bep20", () => {
  let web3: any;
  let usdt: any;

  beforeEach(() => {
    web3 = new Web3("https://mock-chain.local");
    usdt = new web3.eth.Contract([], "0xUSDTContractAddress");
    global.window = {
      ethereum: {
        request: vi.fn(async ({ method }) => {
          if (method === "eth_requestAccounts") {
            return ["0xmosnyik"];
          }
          throw new Error(`Unsupported method: ${method}`);
        }),
      },
    } as any;
  });
  // usdt is transfered from caller to provided wallet
  it("Test transfer of USDT BEP20 from caller to specified wallet", async () => {
    await usdt.methods
      .transfer("0xmosnyik", BigInt(300))
      .send({ from: "0xanotherwallet" });

    const transactions = await spendBEP20(
      "0xmosnyik",
      "0xanotherwallet",
      BigInt(50)
    );
    const mosnyikBal = await usdt.methods.balanceOf("0xmosnyik").call();
    const anotherBal = await usdt.methods.balanceOf("0xanotherwallet").call();

    expect(transactions).not.toBeNull();
    expect(transactions?.transactionHash).toMatch("0x123");
    expect(mosnyikBal).toEqual(BigInt(950));
    expect(anotherBal).toEqual(BigInt(150));
    expect(transactions?.status).toBe(true);
    await expect(
      spendBEP20("0xmosnyik", "0xanotherwallet", BigInt(50))
    ).resolves.toHaveProperty("status", true);
  });
});
