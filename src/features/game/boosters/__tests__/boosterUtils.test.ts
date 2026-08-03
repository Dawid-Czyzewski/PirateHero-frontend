import { describe, expect, it, vi } from 'vitest';
import {
  formatTimeRemaining,
  getTimeRemaining,
  isExpired,
} from '@/features/game/boosters/boosterUtils';

const t = vi.fn((key: string, opts?: Record<string, unknown>) => {
  if (key === 'expired') return 'Expired';
  if (key === 'timeRemainingDaysHours') return `D${opts?.days}H${opts?.hours}`;
  if (key === 'timeRemainingHoursMinutes') return `H${opts?.hours}M${opts?.minutes}`;
  if (key === 'timeRemainingMinutes') return `M${opts?.minutes}`;
  return key;
});

describe('boosterUtils', () => {
  it('isExpired is true for past date', () => {
    expect(isExpired(new Date(Date.now() - 60_000).toISOString())).toBe(true);
  });

  it('isExpired is false for future date', () => {
    expect(isExpired(new Date(Date.now() + 60_000).toISOString())).toBe(false);
  });

  it('formatTimeRemaining uses days when enough diff', () => {
    const diff = 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000;
    expect(formatTimeRemaining(diff, t)).toMatch(/^D/);
  });

  it('getTimeRemaining reads map when present', () => {
    const tr = { b1: 5000 };
    expect(getTimeRemaining('b1', new Date(Date.now() + 10_000).toISOString(), tr)).toBe(5000);
  });
});
