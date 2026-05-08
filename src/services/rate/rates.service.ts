import axios from "axios";
import api from "../api-client";

const engineUrl = process.env.NEXT_PUBLIC_SETTLE_API_URL;

// FETCH ALL RATES FROM PAYMENT ENGINE IN ONE CALL
const fetchAllRatesFromEngine = async (): Promise<{
  rateNumeric: number;
  merchantRate: number;
  profitRate: number;
}> => {
  const response = await axios.get<{
    rate: string;
    rateNumeric: number;
    merchantRate: number;
    profitRate: number;
  }>(`${engineUrl}/rate/all`);
  return {
    rateNumeric: response.data.rateNumeric,
    merchantRate: response.data.merchantRate,
    profitRate: response.data.profitRate,
  };
};

// FETCH CURRENT EXCHANGE RATE FROM PAYMENT ENGINE
export const fetchRate = async (): Promise<number> => {
  try {
    const { rateNumeric } = await fetchAllRatesFromEngine();

    if (isNaN(rateNumeric)) {
      throw new Error("Invalid rate received");
    }

    return rateNumeric;
  } catch (error) {
    console.error("Error fetching rates:", error);
    throw error;
  }
};


// FETCH CURRENT EXCHANGE RATE FROM DB
export const fetchTotalVolume = async (): Promise<number> => {
  try {
    const response = await api.get<{ ytdVolume: string; dbVolume: string }>(
      `/api/dashboard/fetchYTD`
    );
    const rawVolume = response.data.ytdVolume.replace(/[,$]/g, ""); // Remove commas
    const ytdVolume = parseFloat(rawVolume);
    const db = parseFloat(response.data.dbVolume);

    if (isNaN(ytdVolume) || isNaN(db)) {
      throw new Error("Invalid rate received");
    }

    return ytdVolume + db;
  } catch (error) {
    console.error("Error fetching rates:", error);
    throw error;
  }
};

// FETCH MERCHANT RATE FROM PAYMENT ENGINE
export const fetchMerchantRate = async (): Promise<number> => {
  try {
    const { merchantRate } = await fetchAllRatesFromEngine();

    if (isNaN(merchantRate)) {
      throw new Error("Invalid rate received");
    }

    return merchantRate;
  } catch (error) {
    console.error("Error fetching merchant rate:", error);
    throw error;
  }
};

// FETCH PROFIT RATE FROM PAYMENT ENGINE
export const fetchProfitRate = async (): Promise<number> => {
  try {
    const { profitRate } = await fetchAllRatesFromEngine();

    if (isNaN(profitRate)) {
      throw new Error("Invalid profit rate received");
    }

    return profitRate;
  } catch (error) {
    console.error("Error fetching profit rate:", error);
    throw error;
  }
};

