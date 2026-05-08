import { render, screen, renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  writeContract,
  sendTransaction,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { useSpendEVMUSDT } from "../useSpendEVMUSDT";
import { useSpendNative } from "../useSpendBepToken";

// mock wagmi actions
vi.mock("wagmi/actions", () => ({
  writeContract: vi.fn(),
  sendTransaction: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
}));

// Mock receipt object
const mockReceipt = {
  transactionHash: "0xabc123",
  status: "success",
  blockNumber: 100,
};

describe("spendEVMUSDT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send BEP20 token successfully", async () => {
    (writeContract as any).mockResolvedValue("0xhash123");
    (waitForTransactionReceipt as any).mockResolvedValue(mockReceipt);

    const { result } = renderHook(() => useSpendEVMUSDT());

    let receipt;
    await act(async () => {
      receipt = await result.current.spendEVMUSDT("0xRecipient", BigInt(1000));
    });

    expect(writeContract).toHaveBeenCalledWith({
      address: "0xTokenAddress",
      abi: expect.any(Array),
      functionName: "transfer",
      args: ["0xRecipient", BigInt(1000)],
    });

    expect(waitForTransactionReceipt).toHaveBeenCalledWith(undefined, {
      hash: "0xhash123",
    });

    expect(receipt).toEqual(mockReceipt);
    expect(result.current.error).toBeNull();
    // expect(result.current.isLoading).toBe(false);
  });

  it("should handle BEP20 transfer error", async () => {
    (writeContract as any).mockRejectedValue(new Error("transfer failed"));

    const { result } = renderHook(() => useSpendEVMUSDT());

    let receipt;
    await act(async () => {
      receipt = await result.current.spendEVMUSDT("0xRecipient", BigInt(1000));
    });

    expect(receipt).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("transfer failed");
  });
});

describe("useSpendNative", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send native token successfully", async () => {
    (sendTransaction as any).mockResolvedValue("0xhash456");
    (waitForTransactionReceipt as any).mockResolvedValue(mockReceipt);

    const { result } = renderHook(() => useSpendNative());

    let receipt;
    await act(async () => {
      receipt = await result.current.spendNative("0xRecipient", "0.5");
    });

    expect(sendTransaction).toHaveBeenCalledWith({
      to: "0xRecipient",
      value: expect.any(BigInt),
    });

    expect(waitForTransactionReceipt).toHaveBeenCalledWith(undefined, {
      hash: "0xhash456",
    });

    expect(receipt).toEqual(mockReceipt);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle native transfer error", async () => {
    (sendTransaction as any).mockRejectedValue(new Error("insufficient funds"));

    const { result } = renderHook(() => useSpendNative());

    let receipt;
    await act(async () => {
      receipt = await result.current.spendNative("0xRecipient", "1");
    });

    expect(receipt).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("insufficient funds");
  });
});
