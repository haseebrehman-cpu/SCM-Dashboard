import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && /4\d{2}/.test(error.message)) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),

      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: "always",

      networkMode: "online",
    },
    mutations: {
      retry: 0,
      networkMode: "online",
    },
  },
});


