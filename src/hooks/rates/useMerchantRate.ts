import { apiURL } from "@/constants/constants";
import { fetchMerchantRate } from "@/services/rate/rates.service";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useMerchantRate = () => {
  return useQuery<number, Error>({
    queryKey: ["merchant_rate"],
    queryFn: fetchMerchantRate,
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 2000;
      const jitter = Math.random() * 2000;
      return base + jitter;
    },
    staleTime: 15 * 60 * 1000, // 15 mins
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnMount: false,

    refetchOnReconnect: false,
  });
};

export default useMerchantRate;
