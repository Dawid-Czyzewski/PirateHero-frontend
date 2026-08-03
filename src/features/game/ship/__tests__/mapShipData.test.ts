import { describe, expect, it } from 'vitest';
import {
  mapShipApiRoleToShipRole,
  mapShipMemberToShipMember,
  mapShipData,
  mapShipRoleToShipApiRole,
  mapShipUpgradeKeyToApiType,
} from '@/features/game/ship/mapShipData';
import { DEFAULT_SHIP_UPGRADE_PRICING } from '@/features/game/ship/shipUpgradeCosts';
import type { MyShipPayload } from '@/types/ship';

describe('mapShipApiRoleToShipRole', () => {
  it('maps API roles to ship UI roles', () => {
    expect(mapShipApiRoleToShipRole('OWNER')).toBe('OWNER');
    expect(mapShipApiRoleToShipRole('MANAGER')).toBe('MANAGER');
    expect(mapShipApiRoleToShipRole('MEMBER')).toBe('MEMBER');
    expect(mapShipApiRoleToShipRole(undefined)).toBe('MEMBER');
  });
});

describe('mapShipRoleToShipApiRole', () => {
  it('passes through API-native roles', () => {
    expect(mapShipRoleToShipApiRole('OWNER')).toBe('OWNER');
    expect(mapShipRoleToShipApiRole('MANAGER')).toBe('MANAGER');
    expect(mapShipRoleToShipApiRole('MEMBER')).toBe('MEMBER');
  });
});

describe('mapShipUpgradeKeyToApiType', () => {
  it('maps quests UI key to missions API type', () => {
    expect(mapShipUpgradeKeyToApiType('quests')).toBe('missions');
    expect(mapShipUpgradeKeyToApiType('skills')).toBe('skills');
    expect(mapShipUpgradeKeyToApiType('work')).toBe('work');
    expect(mapShipUpgradeKeyToApiType('hull')).toBe('hull');
  });
});

describe('mapShipData', () => {
  const basePayload: MyShipPayload = {
    ship: {
      id: 7,
      title: 'Test Ship',
      description: 'Desc',
      internalNotes: 'Notes',
      maxMembers: 12,
      gold: 100,
      diamonds: 20,
      famePoints: 500,
      skillsUpgrade: 2,
      workUpgrade: 3,
      missionsUpgrade: 4,
      hullUpgrade: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    member: { id: 1, role: 'OWNER', joinedAt: '2026-01-01T00:00:00.000Z' },
    members: [
      {
        id: 1,
        role: 'OWNER',
        joinedAt: '2026-01-01T00:00:00.000Z',
        goldContributed: 10,
        diamondsContributed: 2,
        user: { id: 99, username: 'captain', level: '5', famePoints: 100 },
      },
    ],
  };

  it('returns null when ship is missing', () => {
    expect(mapShipData({ ship: null, member: null }, 99)).toBeNull();
  });

  it('maps ship and members to ShipData', () => {
    const ship = mapShipData(basePayload, 99);
    expect(ship).not.toBeNull();
    expect(ship!.shipId).toBe('7');
    expect(ship!.currentUserId).toBe('99');
    expect(ship!.name).toBe('Test Ship');
    expect(ship!.maxMembers).toBe(12);
    expect(ship!.upgrades.skills).toBe(2);
    expect(ship!.upgrades.work).toBe(3);
    expect(ship!.upgrades.quests).toBe(4);
    expect(ship!.upgrades.training).toBe(0);
    expect(ship!.upgrades.hull).toBe(2);
    expect(ship!.members[0].role).toBe('OWNER');
    expect(ship!.members[0].userId).toBe('99');
    expect(ship!.requiresInvitation).toBe(true);
    expect(ship!.upgradePricing).toEqual(DEFAULT_SHIP_UPGRADE_PRICING);
  });

  it('maps shipUpgradePricing from payload (per-level skills branch)', () => {
    const skills = DEFAULT_SHIP_UPGRADE_PRICING.skills.map((r) =>
      r.level === 3 ? { ...r, gold: 777 } : r
    );
    const ship = mapShipData(
      { ...basePayload, shipUpgradePricing: { ...DEFAULT_SHIP_UPGRADE_PRICING, skills } },
      99
    );
    expect(ship?.upgradePricing.skills.find((x) => x.level === 3)?.gold).toBe(777);
  });
});

describe('mapShipMemberToShipMember', () => {
  it('parses numeric level from string', () => {
    const m = mapShipMemberToShipMember({
      id: 'm1',
      role: 'MEMBER',
      joinedAt: 'x',
      user: { id: 2, username: 'u2', level: '12' },
    });
    expect(m.level).toBe(12);
    expect(m.role).toBe('MEMBER');
  });

  it('passes through avatarName from API user', () => {
    const m = mapShipMemberToShipMember({
      id: 'm1',
      role: 'MEMBER',
      joinedAt: 'x',
      user: { id: 2, username: 'u2', level: '1', avatarName: 'rogue' },
    });
    expect(m.avatarName).toBe('rogue');
  });
});
