import { describe, expect, it } from 'vitest';
import { normalizeShipRankingEntry } from '@/services/ranking/normalizeShipRankingEntry';

describe('normalizeShipRankingEntry', () => {
  it('maps a full API row', () => {
    const out = normalizeShipRankingEntry({
      id: '7',
      title: 'Morskie Wilki',
      totalFamePoints: 2800,
      memberCount: 8,
      memberIds: [1, '2'],
      requiresInvitation: false,
      maxMembers: 10,
      captainUsername: 'Kapitan',
    });
    expect(out).toMatchObject({
      id: '7',
      title: 'Morskie Wilki',
      totalFamePoints: 2800,
      memberCount: 8,
      memberIds: ['1', '2'],
      requiresInvitation: false,
      maxMembers: 10,
      captainUsername: 'Kapitan',
    });
  });

  it('defaults maxMembers when missing', () => {
    const out = normalizeShipRankingEntry({
      id: '1',
      title: 'X',
      totalFamePoints: 0,
      memberCount: 0,
      memberIds: [],
      requiresInvitation: true,
    });
    expect(out.maxMembers).toBe(10);
    expect(out.captainUsername).toBeNull();
  });

  it('treats blank captain as null', () => {
    const out = normalizeShipRankingEntry({
      id: '1',
      title: 'X',
      totalFamePoints: 0,
      memberCount: 0,
      memberIds: [],
      requiresInvitation: false,
      maxMembers: 8,
      captainUsername: '   ',
    });
    expect(out.captainUsername).toBeNull();
  });
});
