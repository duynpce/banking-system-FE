import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3, // Retry failed requests up to 3 times
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on network reconnect
    },
  },
});