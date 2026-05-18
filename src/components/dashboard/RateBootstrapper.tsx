"use client";

import {
  fetchMerchantRate,
  fetchProfitRate,
  fetchRateDetails,
  fetchTotalVolume,
} from "@/services/rate/rates.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { usePaymentStore } from "stores/paymentStore";

// this is an invisible component that fetches and sets the rate in the payment store
export function RateBootstrapper() {
  const { rate, lastRateFetchedAt, setRate } = usePaymentStore();
  const { profitRate, lastProfitRateFetchedAt, setProfitRate } =
    usePaymentStore();
  const { merchantRate, lastMerchantRateFetchedAt, setMerchantRate } =
    usePaymentStore();
  const { totalVolume, lastTotalVolumeFetchedAt, setTotalVolume } =
    usePaymentStore();

  // --- RATE ---
  const shouldFetch = !rate || Date.now() - lastRateFetchedAt > 15 * 60 * 1000;

  const { data: rateData } = useQuery({
    queryKey: ["rate"],
    queryFn: fetchRateDetails,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (rateData?.rateNumeric) {
      setRate(rateData.rateNumeric.toString());
    }
  }, [rateData, setRate]);

  // --- PROFIT RATE ---
  const shouldFetchProfitRate =
    !profitRate || Date.now() - lastProfitRateFetchedAt > 15 * 60 * 1000;

  const { data: profitData } = useQuery({
    queryKey: ["profit_rate"],
    queryFn: fetchProfitRate,
    enabled: shouldFetchProfitRate,
  });

  useEffect(() => {
    if (profitData) {
      setProfitRate(profitData.toString());
    }
  }, [profitData, setProfitRate]);

  // --- MERCHANT RATE ---

  const shouldFetchMerchantRate =
    !merchantRate || Date.now() - lastMerchantRateFetchedAt > 15 * 60 * 1000;

  const { data: merchantData } = useQuery({
    queryKey: ["merchant_rate"],
    queryFn: fetchMerchantRate,
    enabled: shouldFetchMerchantRate,
  });

  useEffect(() => {
    if (merchantData) {
      setMerchantRate(merchantData.toString());
    }
  }, [merchantData, setMerchantRate]);

  // --- TOTAL VOLUME ---

  const shouldFetchVolume =
    !totalVolume || Date.now() - lastTotalVolumeFetchedAt > 15 * 60 * 1000;
  const { data: volumeData } = useQuery({
    queryKey: ["total-volume"],
    queryFn: fetchTotalVolume,
    enabled: shouldFetchVolume,
  });
  useEffect(() => {
    if (volumeData) {
      setTotalVolume(volumeData.toString());
    }
  }, [volumeData, setTotalVolume]);

  return null;
}
