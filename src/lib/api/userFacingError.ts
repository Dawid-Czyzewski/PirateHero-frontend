import { ApiHttpError, ApiParseError } from '@/lib/api/ApiHttpError';
import { NETWORK_UNAVAILABLE_MESSAGE } from '@/lib/api/networkError';

export function getUserFacingApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
  networkMessage?: string
): string {
  if (error instanceof ApiHttpError) {
    if (error.status === 0 && networkMessage !== undefined && networkMessage.trim() !== '') {
      return networkMessage.trim();
    }
    const msg = error.message?.trim();
    return msg || fallbackMessage;
  }
  if (error instanceof ApiParseError) {
    const msg = error.message?.trim();
    return msg || fallbackMessage;
  }
  if (error instanceof Error) {
    const msg = error.message?.trim();
    if (msg) return msg;
  }
  if (typeof error === 'string') {
    const msg = error.trim();
    if (msg) return msg;
  }
  return fallbackMessage;
}

export function getServiceApiErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  return getUserFacingApiErrorMessage(
    error,
    fallbackMessage,
    NETWORK_UNAVAILABLE_MESSAGE
  );
}
