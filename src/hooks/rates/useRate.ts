import { fetchRate } from "@/services/rate/rates.service";
import { useQuery } from "@tanstack/react-query";

const useRate = () => {
  return useQuery<number, Error>({
    queryKey: ["rate"],
    queryFn: fetchRate,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    refetchOnMount: false,

    refetchOnReconnect: false,

    staleTime: 5 * 60 * 1000, // 15 mins
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
