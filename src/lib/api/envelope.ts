import {
  ApiHttpError,
  ApiParseError,
} from '@/lib/api/ApiHttpError';
import { extractProblemMessage } from '@/lib/api/problemMessage';

export type ApiSuccessMeta = {
  message?: string | null;
};

export type ApiSuccessEnvelope<T> = {
  data: T;
  meta: ApiSuccessMeta;
};

export function isApiSuccessEnvelope<T = never>(
  raw: unknown
): raw is ApiSuccessEnvelope<T> {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const o = raw as Record<string, unknown>;
  return 'data' in o && 'meta' in o && o.meta !== null && typeof o.meta === 'object';
}

export function unwrapApiSuccessData<T>(raw: unknown): T {
  if (raw === null || raw === undefined) {
    return undefined as T;
  }
  if (!isApiSuccessEnvelope<T>(raw)) {
    throw new ApiParseError('Expected API envelope { data, meta }');
  }
  return raw.data;
}

export type ResponseBodyValue =
  | null
  | string
  | number
  | boolean
  | ResponseBodyObject
  | ResponseBodyValue[];

export type ResponseBodyObject = { [key: string]: ResponseBodyValue };

export async function readResponseBodyUnknown(
  response: Response
): Promise<ResponseBodyValue> {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text) as ResponseBodyValue;
  } catch {
    return text;
  }
}

export async function parseApiResponse<T>(
  response: Response,
  url = ''
): Promise<T> {
  const body = await readResponseBodyUnknown(response);
  if (!response.ok) {
    const msg = extractProblemMessage(
      body,
      response.statusText || `HTTP ${response.status}`
    );
    throw new ApiHttpError(msg, { status: response.status, url, body });
  }
  return unwrapApiSuccessData<T>(body);
}
