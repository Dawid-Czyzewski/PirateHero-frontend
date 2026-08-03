import { describe, expect, it } from 'vitest';
import { ApiParseError } from '@/lib/api/ApiHttpError';
import {
  isApiSuccessEnvelope,
  parseApiResponse,
  unwrapApiSuccessData,
} from '@/lib/api/envelope';

describe('envelope helpers', () => {
  it('recognizes valid success envelope', () => {
    expect(isApiSuccessEnvelope({ data: { x: 1 }, meta: {} })).toBe(true);
  });

  it('rejects non-envelope payloads', () => {
    expect(isApiSuccessEnvelope({ data: { x: 1 } })).toBe(false);
    expect(isApiSuccessEnvelope(null)).toBe(false);
  });

  it('unwraps data from envelope', () => {
    const out = unwrapApiSuccessData<{ token: string }>({
      data: { token: 'abc' },
      meta: { message: 'ok' },
    });
    expect(out.token).toBe('abc');
  });

  it('throws parse error for wrong success shape', () => {
    expect(() => unwrapApiSuccessData({ token: 'abc' })).toThrow(ApiParseError);
  });

  it('parses successful response and returns data', async () => {
    const response = new Response(
      JSON.stringify({ data: { id: 7 }, meta: {} }),
      { status: 200 }
    );

    const parsed = await parseApiResponse<{ id: number }>(response, '/x');
    expect(parsed.id).toBe(7);
  });
});
