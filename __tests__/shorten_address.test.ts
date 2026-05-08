import ShortenedAddress from "../src/helpers/ShortenAddress";
import { describe, expect, it } from "vitest";

describe("Tets the function to shorten wallet address", () => {
  it("should return the address if the string is less than 9 char", () => {
    expect(ShortenedAddress({ wallet: "" })).toBe("");
    expect(ShortenedAddress({ wallet: "0x123..." })).toBe("0x123...");
    expect(ShortenedAddress({ wallet: "Walletisnowgoodfortest" })).toBe(
      "Walle...test"
    );
  });
});
