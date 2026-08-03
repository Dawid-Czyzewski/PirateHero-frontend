import { describe, expect, it } from 'vitest';
import { formatNotificationRelativeTime } from '@/features/game/notifications/formatNotificationRelativeTime';

describe('formatNotificationRelativeTime', () => {
  const nowMs = 1_700_000_000_000;

  it('returns empty string when iso is missing', () => {
    expect(formatNotificationRelativeTime(undefined, 'en-US', nowMs)).toBe('');
    expect(formatNotificationRelativeTime('', 'en-US', nowMs)).toBe('');
  });

  it('returns empty string when iso is not parseable', () => {
    expect(formatNotificationRelativeTime('not-a-date', 'en-US', nowMs)).toBe('');
  });

  it('formats recent past in seconds for en-US', () => {
    const iso = new Date(nowMs - 20_000).toISOString();
    const out = formatNotificationRelativeTime(iso, 'en-US', nowMs);
    expect(out.length).toBeGreaterThan(0);
    expect(out.toLowerCase()).toMatch(/second/);
  });

  it('formats past interval in minutes for en-US', () => {
    const iso = new Date(nowMs - 120_000).toISOString();
    const out = formatNotificationRelativeTime(iso, 'en-US', nowMs);
    expect(out).toMatch(/2/);
    expect(out.toLowerCase()).toMatch(/minute/);
  });

  it('formats past interval in hours for en-US', () => {
    const iso = new Date(nowMs - 3 * 3_600_000).toISOString();
    const out = formatNotificationRelativeTime(iso, 'en-US', nowMs);
    expect(out).toMatch(/3/);
    expect(out.toLowerCase()).toMatch(/hour/);
  });

  it('formats past interval in days for en-US', () => {
    const iso = new Date(nowMs - 2 * 86_400_000).toISOString();
    const out = formatNotificationRelativeTime(iso, 'en-US', nowMs);
    expect(out).toMatch(/2/);
    expect(out.toLowerCase()).toMatch(/day/);
  });

  it('formats older past in weeks for en-US', () => {
    const iso = new Date(nowMs - 10 * 86_400_000).toISOString();
    const out = formatNotificationRelativeTime(iso, 'en-US', nowMs);
    expect(out.toLowerCase()).toMatch(/week/);
  });
});
