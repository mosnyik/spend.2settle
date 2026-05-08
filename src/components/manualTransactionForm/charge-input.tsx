"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/format_currency";

interface ChargeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChargeInput({ value, onChange }: ChargeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="charge">Charge</Label>
      <Input
        id="charge"
        name="charge"
        type="number"
        placeholder="Enter charge"
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
