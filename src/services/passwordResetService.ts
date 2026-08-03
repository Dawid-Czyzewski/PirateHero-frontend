import type { TFunction } from 'i18next';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { getPrimaryApiErrorMessage } from '@/lib/apiError';

type Envelope<T> = {
  data: T;
  meta?: { message?: string | null };
};

function messageKeyFromResponse(body: unknown): string | null {
  if (body && typeof body === 'object' && 'meta' in body) {
    const meta = (body as Envelope<unknown>).meta;
    if (meta && typeof meta.message === 'string' && meta.message.length > 0) {
      return meta.message;
    }
  }
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail?: unknown }).detail;
    if (typeof detail === 'string' && detail.length > 0) {
      return detail;
    }
  }
  return null;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await publicRequestUnknown('/password-reset/request', {
    method: 'POST',
    body: { email },
  });
}

export async function completePasswordReset(payload: {
  token: string;
  newPassword: string;
  newPasswordRepeat: string;
}): Promise<void> {
  await publicRequestUnknown('/password-reset/complete', {
    method: 'POST',
    body: payload,
  });
}

export function resolvePasswordResetError(
  err: unknown,
  t: TFunction,
  fallbackKey: string,
): string {
  if (err instanceof ApiHttpError) {
    if (err.status === 0) {
      return t('networkUnavailable');
    }
    const key =
      messageKeyFromResponse(err.body) || getPrimaryApiErrorMessage(err.body);
    if (key && t(key) !== key) {
      return t(key);
    }
  }
  return t(fallbackKey);
}
