import {
  buildChargeMenuMessage,
  calculateChargeFromTier,
  commitChargeToStores,
  getChargeContext,
  getChargeTier,
  navigateAfterCharge,
  parsePaymentInput,
} from "@/helpers/transaction/transaction_charge";
import { getLimits } from "@/services/rate/getLimits";
import { getRate } from "@/services/rate/getRates";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

const resolveChargeFrom = (input: "1" | "2"): "fiat" | "crypto" =>
  input === "1" ? "fiat" : "crypto";

export type ChargeContext = {
  ticker: string;
  estimateAsset: "naira" | "dollar" | "crypto";
  assetSymbol: string;
  assetPrice: number;
  isUSDT: boolean;
};

export type ChargeCalculation = {
  nairaCharge: number;
  assetCharge: number;
};

// Holds intermediate charge calculation between the two phases.
// Stored on globalThis so Next.js HMR doesn't reset it between steps.
type PendingCharge = {
  amount: number;
  rate: number;
  context: ChargeContext;
  charge: ChargeCalculation;
};

const g = globalThis as any;
const getPending = (): PendingCharge | null => g.__pendingCharge ?? null;
const setPending = (v: PendingCharge | null) => { g.__pendingCharge = v; };

export const displayCharge = async (input: string) => {
  const { addMessages, setLoading } = useChatStore.getState();

  // ── Phase 2: user picked "1" or "2" from the charge menu ──────────────────
  const pending = getPending();
  if (pending && (input.trim() === "1" || input.trim() === "2")) {
    const { amount, rate, context, charge } = pending;
    const choice = input.trim() as "1" | "2";
    setPending(null);
    usePaymentStore.getState().setChargeFrom(resolveChargeFrom(choice));
    commitChargeToStores(amount, rate, context, charge, input);
    navigateAfterCharge();
    return;
  }

  // ── Phase 1: user entered an amount ───────────────────────────────────────
  setPending(null); // clear any stale pending from a previous attempt

  const { crypto, estimateAsset, setAssetPrice, setPaymentNairaEstimate, setPaymentAssetEstimate } = usePaymentStore.getState();
  const { currentStep } = useChatStore.getState();
  const isRequest = currentStep.transactionType?.toLowerCase() === "request";

  // Request flow: no crypto involved — just capture the NGN amount and move on
  if (isRequest) {
    const amount = parsePaymentInput(input);
    if (amount === null || amount <= 0) {
      addMessages([{ type: "incoming", content: "Please enter a valid amount.", timestamp: new Date() }]);
      return;
    }
    setPaymentNairaEstimate(amount.toString());
    setPaymentAssetEstimate("0");
    navigateAfterCharge();
    return;
  }

  const amount = parsePaymentInput(input);
  if (amount === null) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid amount entered",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  // Show loading for the full async computation (rate + limits)
  setLoading(true);
  let rate: number;
  let limits;
  try {
    [rate, limits] = await Promise.all([
      getRate(),
      getLimits(crypto, estimateAsset),
    ]);
    if (limits.cryptoPrice > 0) {
      setAssetPrice(limits.cryptoPrice.toString());
    }
  } catch (e) {
    console.error("Error fetching rate/limits:", e);
    addMessages([
      {
        type: "incoming",
        content: "Unable to validate amount. Please try again.",
        timestamp: new Date(),
      },
    ]);
    return;
  } finally {
    setLoading(false);
  }

  // Validate bounds
  if (amount < limits.min || amount > limits.max) {
    addMessages([
      {
        type: "incoming",
        content: `Invalid amount. Must be between ${limits.min} and ${limits.max} ${limits.unit}.`,
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const context = getChargeContext();

  if (Number.isNaN(context.assetPrice)) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid asset price configuration",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  let nairaEquivalent: number;
  if (context.estimateAsset === "naira") {
    nairaEquivalent = amount;
  } else if (context.estimateAsset === "dollar") {
    nairaEquivalent = amount * rate;
  } else {
    nairaEquivalent = amount * context.assetPrice * rate;
  }

  const tier = getChargeTier(nairaEquivalent);
  const { assetCharge, nairaCharge } = calculateChargeFromTier(tier, context, rate);

  // If the amount is too small to absorb the fiat charge, auto-add it to crypto
  if (nairaEquivalent <= nairaCharge) {
    usePaymentStore.getState().setChargeFrom("crypto");
    commitChargeToStores(amount, rate, context, { assetCharge, nairaCharge }, "2");
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Your amount is smaller than the service charge, so the charge
            of <b>{assetCharge.toFixed(8)} {context.assetSymbol}</b> has been
            automatically added to the crypto amount.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    navigateAfterCharge();
    return;
  }

  // Amount is large enough — let the user decide
  setPending({ amount, rate, context, charge: { assetCharge, nairaCharge } });
  addMessages([buildChargeMenuMessage({ assetCharge, nairaCharge, context })]);
};
