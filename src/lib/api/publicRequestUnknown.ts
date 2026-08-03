import config from '@/config/env';
import { ApiHttpError, readJsonErrorFromResponse } from '@/lib/api/ApiHttpError';
import { fetchWithRetry } from '@/lib/api/fetchWithRetry';
import { NETWORK_UNAVAILABLE_MESSAGE } from '@/lib/api/networkError';

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

function joinBackendUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${config.backendUrl}${normalized}`;
}

export async function publicRequestUnknown(
  path: string,
  init: JsonRequestInit = {}
): Promise<unknown> {
  const { body, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders as HeadersInit | undefined);
  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/ld+json');
  }

  const url = joinBackendUrl(path);

  let response: Response;
  try {
    response = await fetchWithRetry(url, {
      ...rest,
      headers: Object.fromEntries(headers.entries()),
      body:
        body === undefined
          ? undefined
          : typeof body === 'string'
            ? body
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiHttpError(NETWORK_UNAVAILABLE_MESSAGE, {
      status: 0,
      url,
    });
  }

  if (!response.ok) {
    const { message, body: errBody } = await readJsonErrorFromResponse(response);
    throw new ApiHttpError(message, {
      status: response.status,
      url,
      body: errBody,
    });
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiHttpError('Invalid JSON in response body', {
      status: response.status,
      url,
    });
  }
}
