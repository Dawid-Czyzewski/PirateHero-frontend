import apiService from '@/services/apiService';
import {
  ApiHttpError,
  ApiParseError,
  readJsonErrorFromResponse,
} from '@/lib/api/ApiHttpError';
import { unwrapApiSuccessData } from '@/lib/api/envelope';

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function requestJson<T>(
  path: string,
  init: JsonRequestInit = {}
): Promise<T> {
  const { body, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders as HeadersInit | undefined);
  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/ld+json');
  }

  const response = await apiService(path, {
    ...rest,
    headers: Object.fromEntries(headers.entries()),
    body:
      body === undefined
        ? undefined
        : typeof body === 'string'
          ? body
          : JSON.stringify(body),
  });

  const url = path;

  if (response == null) {
    throw new ApiHttpError('Request failed (no response)', {
      status: 0,
      url,
    });
  }

  if (!response.ok) {
    const { message, body } = await readJsonErrorFromResponse(response);
    throw new ApiHttpError(message, {
      status: response.status,
      url,
      body,
    });
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    const raw: unknown = JSON.parse(text);
    return unwrapApiSuccessData<T>(raw);
  } catch (e) {
    if (e instanceof ApiParseError) {
      throw new ApiHttpError(e.message, {
        status: response.status,
        url,
      });
    }
    throw new ApiHttpError('Invalid JSON in response body', {
      status: response.status,
      url,
    });
  }
}
