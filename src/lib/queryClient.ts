// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "../services/apiClient";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Exit early if not an ApiError
        if (!(error instanceof ApiError)) return failureCount < 3;

        // No retry for these status codes
        const noRetryCodes = [400, 401, 403, 404, 408, 0];
        if (noRetryCodes.includes(error.statusCode)) {
          return false;
        }

        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),

      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      networkMode: "online",
    },
    mutations: {
      retry: false,
      networkMode: "online",
    },
  },
});
