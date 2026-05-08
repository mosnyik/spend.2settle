"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/format_currency";

interface ReceiverAmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReceiverAmountInput({
  value,
  onChange,
}: ReceiverAmountInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="receiverAmount">Receiver Amount</Label>
      <Input
        id="receiverAmount"
        name="receiverAmount"
        type="number"
        placeholder="Enter receiver amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <p className="text-sm text-muted-foreground">
          {formatCurrency(value, "NGN", "en-NG")}
        </p>
      )}
    </div>
  );
}
