import { extractProblemMessage } from '@/lib/api/problemMessage';

export class ApiParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiParseError';
  }
}

export class ApiHttpError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: unknown;

  constructor(
    message: string,
    options: { status: number; url: string; body?: unknown }
  ) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
  }
}

export async function readJsonErrorFromResponse(
  response: Response
): Promise<{ message: string; body: unknown }> {
  const text = await response.text();
  const fallback = response.statusText || `HTTP ${response.status}`;
  if (!text) {
    return { message: fallback, body: undefined };
  }
  try {
    const body: unknown = JSON.parse(text);
    return {
      message: extractProblemMessage(body, fallback),
      body,
    };
  } catch {
    return {
      message: text.length > 200 ? `${text.slice(0, 200)}…` : text,
      body: undefined,
    };
  }
}

export async function readErrorMessageFromResponse(
  response: Response
): Promise<string> {
  const { message } = await readJsonErrorFromResponse(response);
  return message;
}
