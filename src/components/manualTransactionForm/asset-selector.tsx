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
import { ASSETS } from "./ManualTransactionForm";

interface AssetSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AssetSelector({ value, onChange }: AssetSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="asset">Asset</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="asset">
          <SelectValue placeholder="Select asset" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cryptocurrencies</SelectLabel>
            {ASSETS.map((asset) => (
              <SelectItem key={asset.value} value={asset.value}>
                {asset.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
