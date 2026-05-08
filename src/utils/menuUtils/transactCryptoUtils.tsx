
export const calculateCryptoAmount = (userSession: any) => {
    // target is to calculate how much the user would send in crypto
    // 1. what asset is he spending
    // 2. how much of it is he spending in dollars
    // 3. how much is the base asset in dollars
    
    const assetPrice = 114_255 // say this is BTC price
    const spendLimit = 200 // the amount the user want to spend in dollar
    const cryptoAmount = spendLimit/assetPrice
  return cryptoAmount;
};
export const calculateCharge = () => {
  // const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
  // const dollar = ["usdt"];
  // const isCrypto = cryptocurrencies.includes(sharedEstimateAsset.toLowerCase());
  // const isDollar = dollar.includes(sharedEstimateAsset.toLowerCase());
  // const rate = parseFloat(sharedRate);
  // const upperDollar = 2000000 / rate;
  // const lowerDollar = 20000 / rate;
  // const assetPrice = parseFloat(sharedAssetPrice.trim().replace(/[^\d.]/g, ""));
  // const parsedInput = input.trim().replace(/[^\d.]/g, "");

  // const dollarValue = parseFloat(parsedInput) * rate;
  // const cryptoValue = parseFloat(parsedInput) * assetPrice * rate;
  // let charge = 0;

  // let max: number;
  // let min: number;

  // /**
  //  * Remember charges include
  //  * - input < NGN 100,000 = NGN 500
  //  * - NGN 100,000 < input > NGN 1,000,000 = NGN 1,000
  //  * - input > 1,000,000 == NGN 1,500
  //  */

  return 0;
};