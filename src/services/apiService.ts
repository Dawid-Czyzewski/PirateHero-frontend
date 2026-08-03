import config from '@/config/env';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { fetchWithRetry } from '@/lib/api/fetchWithRetry';
import { NETWORK_UNAVAILABLE_MESSAGE } from '@/lib/api/networkError';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { isApiSuccessEnvelope, unwrapApiSuccessData } from '@/lib/api/envelope';

let refreshPromise: Promise<string | null> | null = null;

const logoutAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  window.location.href = '/';
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const raw = await publicRequestUnknown('/token/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
    if (!isApiSuccessEnvelope(raw)) {
      return null;
    }
    const data = unwrapApiSuccessData<{ token: string; refreshToken?: string }>(
      raw
    );
    if (!data?.token) {
      return null;
    }
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    return data.token;
  } catch (e) {
    if (e instanceof ApiHttpError && e.status === 401) {
      logoutAndRedirect();
      throw e;
    }
    return null;
  }
};

type ApiOptions = {
  headers?: Record<string, string>;
  method?: string;
  body?: string;
  [key: string]: unknown;
};

const apiService = async (url: string, options: ApiOptions = {}) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };
  if (!('Content-Type' in headers) && !('content-type' in headers)) {
    headers['Content-Type'] = 'application/ld+json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions: ApiOptions = {
    ...options,
    headers,
  };

  const fullUrl = `${config.backendUrl}${url}`;

  let response: Response;
  try {
    response = await fetchWithRetry(fullUrl, finalOptions);
  } catch {
    throw new ApiHttpError(NETWORK_UNAVAILABLE_MESSAGE, {
      status: 0,
      url,
    });
  }

  if (response.status === 401 && refreshToken) {
    const isNewRefresh = !refreshPromise;
    if (isNewRefresh) {
      refreshPromise = refreshAccessToken(refreshToken).finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const newToken = await refreshPromise;

      if (newToken) {
        const retryOptions: ApiOptions = {
          ...options,
          headers: {
            ...(options.headers ?? {}),
            Authorization: `Bearer ${newToken}`,
            ...((options.headers &&
            ('Content-Type' in options.headers || 'content-type' in options.headers))
              ? {}
              : { 'Content-Type': 'application/ld+json' }),
          },
        };
        try {
          response = await fetchWithRetry(fullUrl, retryOptions);
        } catch {
          throw new ApiHttpError(NETWORK_UNAVAILABLE_MESSAGE, {
            status: 0,
            url,
          });
        }
      } else {
        logoutAndRedirect();
        return null;
      }
    } catch (e) {
      if (e instanceof ApiHttpError && e.status === 401) {
        throw e;
      }
      return null;
    }
  } else if (response.status === 401 && !refreshToken) {
    logoutAndRedirect();
    return null;
  }

  return response;
};

export default apiService;
