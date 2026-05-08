import { formatCurrency } from "@/helpers/format_currency";
import { getLimits } from "@/services/rate/getLimits";
import { getBaseSymbol } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

export const displayPayIn = async (): Promise<boolean> => {
  const currentStep = useChatStore.getState().currentStep;
  const { addMessages, setLoading } = useChatStore.getState();

  const { ticker, crypto, estimateAsset, setAssetPrice } = usePaymentStore.getState();
  const assetSymbol = getBaseSymbol(ticker);

  let limits;
  try {
    setLoading(true);
    limits = await getLimits(crypto, estimateAsset);
    // Cache asset price in store for later use during charge calculation
    if (limits.cryptoPrice > 0) {
      setAssetPrice(limits.cryptoPrice.toString());
    }
  } catch (e) {
    console.error("Error fetching limits:", e);
    addMessages([
      {
        type: "incoming",
        content: "Unable to fetch payment limits. Please try again.",
        timestamp: new Date(),
      },
    ]);
    return false;
  } finally {
    setLoading(false);
  }

  let maxDisplay = "";
  if (estimateAsset.toLowerCase() === "naira") {
    maxDisplay = formatCurrency(limits.max.toString(), "NGN", "en-NG");
  } else if (estimateAsset.toLowerCase() === "dollar") {
    maxDisplay = formatCurrency(limits.max.toFixed(2), "USD", "en-NG");
  } else {
    maxDisplay = `${limits.max.toFixed(5)} ${assetSymbol}`;
  }

  const rangeMessage = maxDisplay ? (
    <span>Maximum allowed: {maxDisplay}</span>
  ) : null;

  console.log(
    "Just to see what sharedPaymentMode is:",
    currentStep.transactionType,
  );
  const paymentMode =
    currentStep.transactionType === "transfer" ||
    currentStep.transactionType === "gift"
      ? "send"
      : "request";

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter the amount you want to {paymentMode} in {estimateAsset}
          {estimateAsset.toLowerCase() === "naira"
            ? ""
            : ` ${assetSymbol}`}{" "}
          value
          <br />
          <br />
          NOTE:
          <b> {rangeMessage}</b>
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  addMessages(newMessages);
  return true;
};
