import { describe, expect, it } from "vitest";
import TruncatedText from "../src/helpers/TruncatedText";

describe("Test the function to shorten a string", () => {
  it("should return the entered string if string length  < provided maxLength", () => {
    expect(TruncatedText({ text: "abc", maxLength: 3 })).toBe("abc");
  });
  it("should return a truncated string with elipse if string length > provided maxLength", () => {
    expect(TruncatedText({ text: "abcd", maxLength: 3 })).toBe("abc...");
  });
});
