import { apiURL } from "@/constants/constants";
import { fetchProfitRate } from "@/services/rate/rates.service";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useProfitRate = () => {
  return useQuery<number, Error>({
    queryKey: ["profit_rate"],
    queryFn: fetchProfitRate,
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 3000;
      const jitter = Math.random() * 3000;
      return base + jitter;
    },
    staleTime: 15 * 60 * 1000, // 15 mins
    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnMount: false,

    refetchOnReconnect: false,
  });
};

export default useProfitRate;
