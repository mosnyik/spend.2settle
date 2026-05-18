import {
  EngineRateDetails,
  fetchRateDetails,
} from "@/services/rate/rates.service";
import { useQuery } from "@tanstack/react-query";

const RATE_REFETCH_INTERVAL_MS = 15 * 60 * 1000;
const RATE_REFETCH_JITTER_MS = 60 * 1000;

const useRate = () => {
  return useQuery<EngineRateDetails, Error>({
    queryKey: ["rate"],
    queryFn: fetchRateDetails,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnMount: false,

    refetchOnReconnect: false,

    refetchInterval: () =>
      RATE_REFETCH_INTERVAL_MS + Math.random() * RATE_REFETCH_JITTER_MS,

    refetchIntervalInBackground: false,

    staleTime: 15 * 60 * 1000,
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      return base + jitter;
    },
  });
};

export default useRate;
