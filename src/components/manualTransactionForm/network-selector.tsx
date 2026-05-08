"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USDT_NETWORKS } from "./ManualTransactionForm";

interface NetworkSelectorProps {
  asset: string;
  value: string;
  onChange: (value: string) => void;
}

export function NetworkSelector({
  asset,
  value,
  onChange,
}: NetworkSelectorProps) {
  // Determine if the selected asset is USDT
  const isUSDT = asset.startsWith("USDT");

  return (
    <div className="space-y-2">
      <Label htmlFor="network">Network</Label>
      {isUSDT ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="network">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>USDT Networks</SelectLabel>
              {USDT_NETWORKS.map((network) => (
                <SelectItem key={network.value} value={network.value}>
                  {network.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Input id="network" value={value} readOnly className="bg-muted" />
      )}
    </div>
  );
}
