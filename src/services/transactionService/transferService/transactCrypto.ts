export function calculateCharge(
  amount: string,
  payment_mode: string,
  shared_rate: string,
  asset_price: string
) {
  const numAmount = Number.parseFloat(amount.replace(/[^\d.]/g, ""));
  let basic, median, premium;
  const rate = Number.parseFloat(shared_rate);
  const assetPrice = Number.parseFloat(asset_price);

  if (!rate || !assetPrice) {
    console.error("Invalid rate or asset price:", { rate, assetPrice });
    return 0;
  }

  if (payment_mode.toLowerCase().trim() === "usdt") {
    basic = 500 / rate;
    median = 1_000 / rate;
    premium = 1_500 / rate;
  } else {
    basic = 500 / rate / assetPrice;
    median = 1000 / rate / assetPrice;
    premium = 1500 / rate / assetPrice;
  }

  const nairaCharge =
    numAmount <= 100_000
      ? 500
      : numAmount > 100_000 && numAmount <= 1_000_000
      ? 1_000
      : 1_500;

  const cryptoCharge =
    nairaCharge === 500
      ? basic
      : nairaCharge === 1_000
      ? median
      : nairaCharge === 1_500
      ? premium
      : 0;

  return cryptoCharge;
}
