"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/format_currency";

interface AmountInputProps {
  value: string;
  estimation: string;
  asset: string;
  onChange: (value: string) => void;
}

export function AmountInput({
  value,
  estimation,
  asset,
  onChange,
}: AmountInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <Input
        id="amount"
        name="amount"
        type="number"
        placeholder="Enter amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <p className="text-sm text-muted-foreground">
          {estimation === "naira"
            ? formatCurrency(value, "NGN", "en-NG")
            : estimation === "dollar"
            ? formatCurrency(value, "USD", "en-NG")
            : `${value} ${
                asset !== "USDT-ERC20" &&
                asset !== "USDT-BEP20" &&
                asset !== "USDT-TRC20"
                  ? asset
                  : ""
              }`}
        </p>
      )}
    </div>
  );
}
