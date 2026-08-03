const DEFAULT_RETRIES = 2;
const DEFAULT_BASE_DELAY_MS = 400;

function isLikelyTransientNetworkFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('load failed') ||
    m.includes('network request failed')
  );
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: { retries?: number; baseDelayMs?: number } = {}
): Promise<Response> {
  const maxRetries = options.retries ?? DEFAULT_RETRIES;
  const baseDelay = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(input, init);
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries && isLikelyTransientNetworkFailure(e)) {
        await new Promise(r =>
          setTimeout(r, baseDelay * 2 ** attempt)
        );
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}
