import axios from "axios";
import api from "../api-client";

const engineUrl = process.env.NEXT_PUBLIC_SETTLE_API_URL;

function parseRate(value: string | number): number {
  const numericRate =
    typeof value === "number" ? value : Number(value.replace(/,/g, ""));

  if (isNaN(numericRate)) {
    throw new Error("Invalid rate received");
  }

  return numericRate;
}

export interface EngineRateDetails {
  rateNumeric: number;
  merchantRate: number;
  profitRate: number;
  updatedAt: string | null;
}

// FETCH ALL RATES FROM PAYMENT ENGINE IN ONE CALL
export const fetchAllRatesFromEngine = async (): Promise<EngineRateDetails> => {
  const response = await axios.get<{
    rate: string | number;
    rateNumeric: string | number;
    merchantRate: string | number;
    profitRate: string | number;
    updatedAt?: string | null;
    update_at?: string | null;
  }>(`${engineUrl}/rate/all`);

  return {
    rateNumeric: parseRate(response.data.rateNumeric ?? response.data.rate),
    merchantRate: parseRate(response.data.merchantRate),
    profitRate: parseRate(response.data.profitRate),
    updatedAt: response.data.updatedAt ?? response.data.update_at ?? null,
  };
};

export const fetchRateDetails = async (): Promise<EngineRateDetails> => {
  const details = await fetchAllRatesFromEngine();

  if (isNaN(details.rateNumeric)) {
    throw new Error("Invalid rate received");
  }

  return details;
};

// FETCH CURRENT EXCHANGE RATE FROM PAYMENT ENGINE
export const fetchRate = async (): Promise<number> => {
  try {
    const { rateNumeric } = await fetchRateDetails();

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
      `/api/dashboard/fetchYTD`,
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
    return profitRate;
  } catch (error) {
    console.error("Error fetching profit rate:", error);
    throw error;
  }
};
