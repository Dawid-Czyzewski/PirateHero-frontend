import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import config from '@/config/env';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';

const server = setupServer(
  http.post(`${config.backendUrl}/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (body.email === '401@test.com') {
      return HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
    }
    return HttpResponse.json({
      data: { token: 'a', refresh_token: 'b', user: { id: '1' } },
      meta: {},
    });
  }),
  http.get(`${config.backendUrl}/ping-public`, () =>
    HttpResponse.json({ ok: true })
  )
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('publicRequestUnknown', () => {
  it('returns parsed JSON on success (no envelope unwrap)', async () => {
    const raw = await publicRequestUnknown('/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'x' },
    });
    expect(raw).toMatchObject({
      data: { token: 'a', refresh_token: 'b', user: { id: '1' } },
    });
  });

  it('throws ApiHttpError with parsed body on failure', async () => {
    try {
      await publicRequestUnknown('/login', {
        method: 'POST',
        body: { email: '401@test.com', password: 'x' },
      });
      expect.fail('expected throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiHttpError);
      const err = e as ApiHttpError;
      expect(err.status).toBe(401);
      expect(err.body).toMatchObject({ detail: 'Invalid credentials' });
    }
  });

  it('supports GET', async () => {
    const raw = await publicRequestUnknown('/ping-public', { method: 'GET' });
    expect(raw).toEqual({ ok: true });
  });
});
