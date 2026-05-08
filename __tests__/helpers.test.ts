import { describe, expect, it, vi } from "vitest";

vi.mock("web3", () => {
  const mockSendTransaction = vi.fn().mockResolvedValue("mock-receipt");
  return {
    default: vi.fn(() => ({
      eth: {
        getChainId: vi.fn().mockResolvedValue(1),
        sendTransaction: mockSendTransaction,
        utils: {
          toWei: vi
            .fn()
            .mockImplementation((amount) => `${amount}000000000000000000`),
        },
      },
    })),
  };
});

describe("send eth", () => {
  it("should", () => {
    const result = "";
    expect(result).toBeDefined();
  });
});
