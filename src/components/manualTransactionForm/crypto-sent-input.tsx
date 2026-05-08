"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CryptoSentInputProps {
  value: string;
  asset: string;
  onChange: (value: string) => void;
}

export function CryptoSentInput({
  value,
  asset,
  onChange,
}: CryptoSentInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cryptoSent">Crypto Sent</Label>
      <Input
        id="cryptoSent"
        name="cryptoSent"
        type="number"
        placeholder="Enter crypto amount sent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && asset && (
        <p className="text-sm text-muted-foreground">{`${value} ${
          asset.split("-")[0]
        }`}</p>
      )}
    </div>
  );
}

