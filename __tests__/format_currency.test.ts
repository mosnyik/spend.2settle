import { formatCurrency } from "../src/helpers/format_currency";
import { it, expect, describe } from 'vitest'

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency("1000", "USD")).toBe("$1,000.00");
    expect(formatCurrency("1000.5", "USD")).toBe("$1,000.50");
    expect(formatCurrency("0.99", "USD")).toBe("$0.99");
  });
  

  it("should format NGN correctly", () => {
    expect(formatCurrency("1000", "NGN", "en-NG")).toBe("₦1,000.00");
    expect(formatCurrency("1000.5", "NGN", "en-NG")).toBe("₦1,000.50");
    expect(formatCurrency("0.99", "NGN", "en-NG")).toBe("₦0.99");
  });

  it("should throw an error for invalid input", () => {
    expect(() => formatCurrency("invalid", "USD")).toThrow("Invalid number");
  });
});

