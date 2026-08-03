import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApiHttpError } from '@/lib/api/ApiHttpError';

vi.mock('@/services/apiService', () => ({
  default: vi.fn(),
}));

import apiService from '@/services/apiService';
import fightService from '@/services/fightService';

describe('fightService', () => {
  beforeEach(() => {
    vi.mocked(apiService).mockReset();
  });

  it('getOpponents throws ApiHttpError when apiService returns null', async () => {
    vi.mocked(apiService).mockResolvedValue(null);
    await expect(fightService.getOpponents()).rejects.toThrow(ApiHttpError);
  });

  it('getOpponents returns envelope data', async () => {
    vi.mocked(apiService).mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: '1' }], meta: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const out = await fightService.getOpponents();
    expect(out).toEqual([{ id: '1' }]);
  });
});
