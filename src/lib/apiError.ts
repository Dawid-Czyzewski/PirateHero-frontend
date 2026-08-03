export { extractProblemMessage } from '@/lib/api/problemMessage';
export {
  getUserFacingApiErrorMessage,
  getServiceApiErrorMessage,
} from '@/lib/api/userFacingError';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function readNonEmptyString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  return trimmed === '' ? '' : trimmed;
}

export function getPrimaryApiErrorMessage(body: unknown): string {
  if (!isRecord(body)) {
    return '';
  }

  const violations = body.violations;
  if (Array.isArray(violations) && violations.length > 0) {
    const first = violations[0];
    if (isRecord(first)) {
      const message = readNonEmptyString(first.message);
      if (message) {
        return message;
      }
    }
  }

  for (const key of ['detail', 'message', 'title'] as const) {
    const message = readNonEmptyString(body[key]);
    if (message) {
      return message;
    }
  }

  return '';
}

export function isAccountNotActivatedError(primary: string, rawBody: unknown): boolean {
  const blob = JSON.stringify(rawBody ?? {});
  return (
    primary === 'accountNotActivated' ||
    blob.includes('accountNotActivated') ||
    primary.toLowerCase().includes('not activated')
  );
}
