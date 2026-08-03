import { describe, expect, it } from 'vitest';
import {
  clonePayload,
  isShipOwner,
} from '@/features/game/ship/hooks/shipOptimistic';
import type { MyShipPayload } from '@/types/ship';
import type { ShipData } from '@/features/game/ship/shipTypes';

describe('shipOptimistic', () => {
  it('clonePayload deep-clones without sharing nested refs', () => {
    const payload = {
      ship: { id: 1, title: 'A', gold: 10 },
      member: { id: 1, role: 'OWNER' },
      members: [],
    } as unknown as MyShipPayload;
    const cloned = clonePayload(payload);
    expect(cloned).not.toBe(payload);
    expect(cloned?.ship).not.toBe(payload.ship);
    expect(cloned?.ship?.title).toBe('A');
    if (cloned?.ship) {
      (cloned.ship as { title?: string }).title = 'B';
    }
    expect(payload.ship.title).toBe('A');
  });

  it('clonePayload returns null for null input', () => {
    expect(clonePayload(null)).toBeNull();
  });

  it('isShipOwner is true only for OWNER role of current user', () => {
    const ship: ShipData = {
      shipId: '1',
      currentUserId: 'u1',
      requiresInvitation: true,
      name: 'S',
      description: '',
      internalNotes: '',
      fame: 0,
      gold: 0,
      diamonds: 0,
      members: [
        {
          userId: 'u1',
          name: 'Me',
          level: 1,
          role: 'OWNER',
          goldContributed: 0,
          diamondsContributed: 0,
        },
      ],
      upgrades: { skills: 0, work: 0, quests: 0, training: 0, hull: 0 },
      maxMembers: 10,
      upgradePricing: {} as ShipData['upgradePricing'],
    };
    expect(isShipOwner(ship)).toBe(true);
    ship.members[0].role = 'MEMBER';
    expect(isShipOwner(ship)).toBe(false);
    expect(isShipOwner(null)).toBe(false);
  });
});
