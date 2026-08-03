import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestJson } from '@/lib/api/requestJson';
import apiService from '@/services/apiService';

vi.mock('@/services/apiService', () => ({
  default: vi.fn(),
}));

const mockedApiService = vi.mocked(apiService);

describe('requestJson', () => {
  beforeEach(() => {
    mockedApiService.mockReset();
  });

  it('serializes body and unwraps success envelope', async () => {
    mockedApiService.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { value: 42 }, meta: {} }), {
        status: 200,
      })
    );

    const out = await requestJson<{ value: number }>('/sample', {
      method: 'POST',
      body: { x: 1 },
    });

    expect(out.value).toBe(42);
    expect(mockedApiService).toHaveBeenCalledWith('/sample', {
      method: 'POST',
      headers: { 'content-type': 'application/ld+json' },
      body: JSON.stringify({ x: 1 }),
    });
  });

  it('throws ApiHttpError on non-ok response', async () => {
    mockedApiService.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'boom' }), { status: 400 })
    );

    await expect(requestJson('/broken')).rejects.toMatchObject({
      name: 'ApiHttpError',
      status: 400,
      url: '/broken',
      body: { detail: 'boom' },
    });
  });

  it('throws ApiHttpError when backend returns no response', async () => {
    mockedApiService.mockResolvedValueOnce(null as never);

    await expect(requestJson('/null')).rejects.toMatchObject({
      name: 'ApiHttpError',
      status: 0,
      url: '/null',
    });
  });
});
