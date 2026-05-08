"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/format_currency";

interface RateInputsProps {
  currentRate: string;
  profitRate: string;
  onCurrentRateChange: (value: string) => void;
  onProfitRateChange: (value: string) => void;
}

export function RateInputs({
  currentRate,
  profitRate,
  onCurrentRateChange,
  onProfitRateChange,
}: RateInputsProps) {
  // Calculate merchant rate
  const merchantRate =
    (Number.parseFloat(currentRate) || 0) +
    (Number.parseFloat(profitRate) || 0);

  return (
    <>
      {/* Current Rate */}
      <div className="space-y-2">
        <Label htmlFor="currentRate">Current Rate</Label>
        <Input
          id="currentRate"
          name="currentRate"
          type="number"
          placeholder="Enter current rate"
          value={currentRate}
          onChange={(e) => onCurrentRateChange(e.target.value)}
        />
        {currentRate && (
          <p className="text-sm text-muted-foreground">
            {formatCurrency(currentRate, "NGN", "en-NG")}
          </p>
        )}
      </div>

      {/* Merchant Rate */}
      <div className="space-y-2">
        <Label htmlFor="merchantRate">Merchant Rate</Label>
        <Input
          id="merchantRate"
          name="merchantRate"
          type="number"
          placeholder="Enter merchant rate"
          value={merchantRate.toString()}
          className="bg-muted"
          disabled={true}
        />
        {merchantRate > 0 && (
          <p className="text-sm text-muted-foreground">
            {formatCurrency(merchantRate.toString(), "NGN", "en-NG")}
          </p>
        )}
      </div>

      {/* Profit Rate */}
      <div className="space-y-2">
        <Label htmlFor="profitRate">Profit Rate</Label>
        <Input
          id="profitRate"
          name="profitRate"
          type="number"
          placeholder="Enter profit rate"
          value={profitRate}
          onChange={(e) => onProfitRateChange(e.target.value)}
        />
        {profitRate && (
          <p className="text-sm text-muted-foreground">
            {formatCurrency(profitRate, "NGN", "en-NG")}
          </p>
        )}
      </div>
    </>
  );
}
