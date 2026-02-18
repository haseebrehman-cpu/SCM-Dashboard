import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Enable a small number of retries with exponential backoff
      retry: (failureCount, error) => {
        // Do not retry for 4xx errors (client / validation issues)
        if (error instanceof Error && /4\d{2}/.test(error.message)) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),

      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache garbage collection after 30 minutes
      gcTime: 30 * 60 * 1000,

      // UX-oriented refetch behaviour
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: "always",

      // Ensure queries only run when online by default
      networkMode: "online",
    },
    mutations: {
      // Mutations should generally fail fast; opt-in per-mutation retries if needed
      retry: 0,
      networkMode: "online",
    },
  },
});


