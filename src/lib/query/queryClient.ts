import { QueryClient } from '@tanstack/react-query';
import { shouldRetryMutation, shouldRetryQuery } from '@/lib/api/networkError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      networkMode: 'online',
    },
    mutations: {
      retry: shouldRetryMutation,
      networkMode: 'online',
    },
  },
});
