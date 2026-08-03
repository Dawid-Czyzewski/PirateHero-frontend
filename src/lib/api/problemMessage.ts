function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

export function extractProblemMessage(
  body: unknown,
  fallback: string
): string {
  if (body === null || body === undefined) {
    return fallback;
  }
  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (!trimmed) {
      return fallback;
    }
    try {
      return extractProblemMessage(JSON.parse(trimmed), fallback);
    } catch {
      return trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed;
    }
  }
  if (!isRecord(body)) {
    return fallback;
  }
  for (const key of ['detail', 'message', 'title'] as const) {
    const value = body[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return fallback;
}
