import { describe, expect, it } from 'vitest';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { ensureApiResponse } from '@/lib/api/ensureResponse';

describe('ensureApiResponse', () => {
  it('throws ApiHttpError when response is null', () => {
    expect(() => ensureApiResponse(null, '/fights')).toThrow(ApiHttpError);
    try {
      ensureApiResponse(null, '/fights');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiHttpError);
      expect((e as ApiHttpError).status).toBe(0);
    }
  });

  it('does not throw for Response', () => {
    const r = new Response('{}');
    expect(() => ensureApiResponse(r, '/x')).not.toThrow();
  });
});
