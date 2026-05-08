import { ErrorState } from "@/types/error_types";
import { useState, useCallback } from "react";

export default function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((errorMessage: string) => {
    setError({ hasError: true, message: errorMessage });
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError({ hasError: false, message: null });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return { error, isLoading, handleError, clearError, setLoading };
}
