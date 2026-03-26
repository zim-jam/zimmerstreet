import { useQuery } from "@tanstack/react-query";
import { getForecast, ApiError } from "../api/zimmer";

export function useForecast(ticker: string) {
  const normalizedTicker = ticker?.trim().toUpperCase() || "";

  return useQuery({
    queryKey: ["forecast", normalizedTicker],

    queryFn: () => getForecast(normalizedTicker),

    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.status === 404) return false;
        if (error.status === 400) return false;
      }
      return failureCount < 3;
    },

    staleTime: 1000 * 60 * 5,

    enabled: Boolean(normalizedTicker !== ""),
  });
}
