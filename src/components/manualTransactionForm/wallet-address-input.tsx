"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WalletAddress } from "@/lib/wallets/types";

interface WalletAddressInputProps {
  value: WalletAddress;
  onChange: (value: WalletAddress) => void;
}

export function WalletAddressInput({
  value,
  onChange,
}: WalletAddressInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="walletAddress">Wallet Address</Label>
      <Input
        id="walletAddress"
        name="walletAddress"
        placeholder="Enter wallet address"
        value={value as string}
        onChange={(e) => onChange(e.target.value as unknown as WalletAddress)}
      />
    </div>
  );
}
