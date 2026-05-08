"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomerNumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerNumberInput({
  value,
  onChange,
}: CustomerNumberInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="customerNumber">Customer Number</Label>
      <Input
        id="customerNumber"
        name="customerNumber"
        placeholder="Enter customer number"
        value={value}
        onChange={(e) => {
          // Validate customer phone number (exactly 11 digits)
          if (e.target.value.length <= 11) {
            onChange(e.target.value);
          }
        }}
      />
    </div>
  );
}
