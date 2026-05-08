import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
interface Props {
  wallet: string;
  network: string;
  isCopyDisabled: boolean;
  onCopy: () => void;
  truncateWallet: (wallet: string) => string;
}

const WalletInfo = ({
  wallet,
  network,
  isCopyDisabled,
  onCopy,
  truncateWallet,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-sm text-center">
        Here is {network.toUpperCase()} wallet for your transaction :
        {truncateWallet(wallet)}
      </p>

      <Button
        onClick={onCopy}
        disabled={isCopyDisabled}
        variant="outline"
        size="sm"
      >
        {!isCopyDisabled ? (
          <>
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy wallet</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            <span>Wallet copied</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default WalletInfo;
