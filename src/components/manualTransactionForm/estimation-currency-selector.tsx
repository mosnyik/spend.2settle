"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTIMATION_CURRENCIES } from "./ManualTransactionForm";

interface EstimationCurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function EstimationCurrencySelector({
  value,
  onChange,
}: EstimationCurrencySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="estimation">Estimation Currency</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="estimation">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Currencies</SelectLabel>
            {ESTIMATION_CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
