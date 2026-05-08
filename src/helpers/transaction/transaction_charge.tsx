import {
  ChargeCalculation,
  ChargeContext,
} from "@/features/chatbot/handlers/chatHandlers/menus/display.charge";
import { displaySearchBank } from "@/features/chatbot/handlers/chatHandlers/menus/display.bank.search";
import { displayEnterPhone } from "@/features/chatbot/handlers/chatHandlers/menus/display.phone";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { formatCurrency } from "../format_currency";
import { useTransactionStore } from "stores/transactionStore";

type ChargeMenuInput = {
  assetCharge: number;
  nairaCharge: number;
  context: ChargeContext;
};

export function parsePaymentInput(input: string): number | null {
  const cleaned = input.trim().replace(/[^\d.]/g, "");
  const value = parseFloat(cleaned);

  return Number.isFinite(value) ? value : null;
}

export function getChargeContext(): ChargeContext {
  const {
    ticker,
    estimateAsset,
    crypto,
    assetPrice: rawAssetPrice,
  } = usePaymentStore.getState();

  const assetPrice = parseFloat(rawAssetPrice.trim().replace(/[^\d.]/g, ""));

  const normalizedEstimate =
    estimateAsset.toLowerCase() === "naira"
      ? "naira"
      : estimateAsset.toLowerCase() === "dollar" ||
          estimateAsset.toLowerCase() === "usdt"
        ? "dollar"
        : "crypto";

  return {
    ticker,
    estimateAsset: normalizedEstimate,
    assetSymbol: crypto,
    assetPrice,
    isUSDT: ticker.toLowerCase() === "usdt",
  };
}

export type ChargeTier = 500 | 1000 | 1500;

export function getChargeTier(nairaValue: number): ChargeTier {
  if (nairaValue <= 100_000) return 500;
  if (nairaValue <= 1_000_000) return 1000;
  return 1500;
}

export function calculateChargeFromTier(
  tier: ChargeTier,
  context: ChargeContext,
  rate: number,
): ChargeCalculation {
  let assetCharge: number;

  if (context.isUSDT) {
    assetCharge = tier / rate;
  } else {
    assetCharge = tier / rate / context.assetPrice;
  }

  return {
    nairaCharge: tier,
    assetCharge,
  };
}

export function buildChargeMenuMessage({
  assetCharge,
  nairaCharge,
  context,
}: ChargeMenuInput): MessageType {
  const isDollar = context.isUSDT;

  const assetDisplay = isDollar
    ? formatCurrency(assetCharge.toFixed(9), "USD")
    : `${assetCharge.toFixed(9)} ${context.assetSymbol}`;

  const nairaDisplay = formatCurrency(nairaCharge.toString(), "NGN", "en-NG");

  return {
    type: "incoming",
    timestamp: new Date(),
    content: (
      <span>
        Here is your menu:
        <br />
        <br />
        Charge:
        <b>
          {assetDisplay} = {nairaDisplay}
        </b>
        <br />
        1. Charge from the Fiat(Naira) amount
        <br />
        2. Add charges to the {context.assetSymbol} amount
        <br />
        0. Go back
        <br />
        00. Exit
      </span>
    ),
  };
}

export function commitChargeToStores(
  amount: number,
  rate: number,
  context: ChargeContext,
  charge: ChargeCalculation,
  input: string,
) {
  const {
    setPaymentAssetEstimate,
    setPaymentNairaEstimate,
    setNairaCharge,
    setDollarCharge,
  } = usePaymentStore.getState();

  const { updateTransaction } = useTransactionStore.getState();

  let paymentAssetEstimate: number;
  let paymentNairaEstimate: number;

  if (context.estimateAsset === "naira") {
    paymentNairaEstimate = amount;
    paymentAssetEstimate = context.isUSDT
      ? amount / rate
      : amount / (rate * context.assetPrice);
  } else if (context.estimateAsset === "dollar") {
    paymentAssetEstimate = context.isUSDT
      ? amount
      : amount / context.assetPrice;
    paymentNairaEstimate = amount * rate;
  } else {
    paymentAssetEstimate = amount;

    paymentNairaEstimate = context.isUSDT
      ? amount * rate
      : amount * rate * context.assetPrice;
  }

  // Apply charge based on user's selection
  if (input.trim() === "1") {
    // Charge deducted from Fiat (Naira) - asset stays same, naira decreases
    paymentNairaEstimate -= charge.nairaCharge;
  }
  if (input.trim() === "2") {
    // Charge added to crypto - asset increases, naira stays same
    paymentAssetEstimate += charge.assetCharge;
  }

  console.log({ paymentAssetEstimate });
  console.log({ paymentNairaEstimate });

  // set estimations
  setPaymentAssetEstimate(paymentAssetEstimate.toString());
  setPaymentNairaEstimate(paymentNairaEstimate.toString());

  // Set charges
  setNairaCharge(formatCurrency(charge.nairaCharge.toString(), "NGN", "en-NG"));
  setDollarCharge(charge.assetCharge.toFixed(8).toString());

  updateTransaction({ charges: charge.assetCharge.toString() });
}

export function navigateAfterCharge() {
  const { currentStep, next } = useChatStore.getState();

  if (currentStep.transactionType?.toLowerCase() === "gift") {
    next({ stepId: "enterPhone" });
    displayEnterPhone();
  } else {
    next({ stepId: "enterBankSearchWord" });
    displaySearchBank();
  }
}
