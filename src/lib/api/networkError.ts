import { ApiHttpError } from '@/lib/api/ApiHttpError';

export const NETWORK_UNAVAILABLE_MESSAGE =
  'Network unavailable. Check your connection and try again.';

export function isNetworkStatus(status: number): boolean {
  return status === 0;
}

export function isRetryableServerError(status: number): boolean {
  return status >= 502 && status <= 504;
}

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;
  if (error instanceof ApiHttpError) {
    return (
      isNetworkStatus(error.status) || isRetryableServerError(error.status)
    );
  }
  return failureCount < 1;
}

export function shouldRetryMutation(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  if (error instanceof ApiHttpError) {
    return (
      isNetworkStatus(error.status) || isRetryableServerError(error.status)
    );
  }
  return false;
}
