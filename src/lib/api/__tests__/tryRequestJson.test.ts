import { describe, expect, it, vi, beforeEach } from 'vitest';
import { tryRequestJson } from '@/lib/api/tryRequestJson';
import { requestJson } from '@/lib/api/requestJson';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

describe('tryRequestJson', () => {
  beforeEach(() => {
    vi.mocked(requestJson).mockReset();
  });

  it('returns ok + data when requestJson succeeds', async () => {
    vi.mocked(requestJson).mockResolvedValueOnce({ x: 1 });
    const out = await tryRequestJson<{ x: number }>('/a', { method: 'GET' });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.x).toBe(1);
  });

  it('returns ok false + message when requestJson throws', async () => {
    vi.mocked(requestJson).mockRejectedValueOnce(new Error('nope'));
    const out = await tryRequestJson('/b');
    expect(out.ok).toBe(false);
    if (out.ok === false) expect(out.message).toBe('nope');
  });
});
