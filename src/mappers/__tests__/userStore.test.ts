import { describe, expect, it } from 'vitest';
import {
  mapShelfItemToBuyConfirm,
  mapUserStoreFromApi,
  mapWearableItemFromApi,
} from '@/mappers/userStore';
import type { UserStoreShelfItemDto } from '@/types/userStore';

describe('mapShelfItemToBuyConfirm', () => {
  it('returns null for null, undefined', () => {
    expect(mapShelfItemToBuyConfirm(null)).toBeNull();
    expect(mapShelfItemToBuyConfirm(undefined)).toBeNull();
  });

  it('returns null when name, type or price are wrong type', () => {
    expect(
      mapShelfItemToBuyConfirm({ name: 1, type: 'a', price: 10 } as unknown as UserStoreShelfItemDto)
    ).toBeNull();
    expect(
      mapShelfItemToBuyConfirm({ name: 'a', type: 2, price: 10 } as unknown as UserStoreShelfItemDto)
    ).toBeNull();
    expect(
      mapShelfItemToBuyConfirm({ name: 'a', type: 'b', price: '10' } as unknown as UserStoreShelfItemDto)
    ).toBeNull();
  });

  it('maps valid item without rarity', () => {
    expect(
      mapShelfItemToBuyConfirm({ name: 'Sword', type: 'WEAPON', price: 99 })
    ).toEqual({ name: 'Sword', type: 'WEAPON', price: 99 });
  });

  it('includes rarity only when non-empty string', () => {
    expect(
      mapShelfItemToBuyConfirm({ name: 'Sword', type: 'WEAPON', price: 1, rarity: 'rare' })
    ).toEqual({ name: 'Sword', type: 'WEAPON', price: 1, rarity: 'rare' });
    expect(
      mapShelfItemToBuyConfirm({ name: 'Sword', type: 'WEAPON', price: 1, rarity: '' })
    ).toEqual({ name: 'Sword', type: 'WEAPON', price: 1 });
  });
});

describe('mapUserStoreFromApi', () => {
  it('returns null for non-objects', () => {
    expect(mapUserStoreFromApi(null)).toBeNull();
    expect(mapUserStoreFromApi(undefined)).toBeNull();
    expect(mapUserStoreFromApi('x')).toBeNull();
    expect(mapUserStoreFromApi(1)).toBeNull();
    expect(mapUserStoreFromApi([])).toBeNull();
  });

  it('maps empty object to empty store', () => {
    expect(mapUserStoreFromApi({})).toEqual({});
  });

  it('maps refresh flags and slots with items', () => {
    const raw = {
      isFreeRefreshAvailable: true,
      refreshCost: 50,
      storeSlots: [
        { id: 's1', slotNumber: 1, item: { name: 'A', type: 'T', price: 10, rarity: 'common' } },
        null,
        { id: 2, item: null },
      ],
    };
    const out = mapUserStoreFromApi(raw);
    expect(out).toEqual({
      isFreeRefreshAvailable: true,
      refreshCost: 50,
      storeSlots: [
        { id: 's1', slotNumber: 1, item: { name: 'A', type: 'T', price: 10, rarity: 'common' } },
        { id: 2, item: null },
      ],
    });
  });

  it('maps nested statistics on items', () => {
    const out = mapUserStoreFromApi({
      storeSlots: [
        {
          id: 1,
          item: {
            name: 'Helm',
            type: 'ARMOR',
            price: 5,
            statistics: { strongPoints: 2, agilityPoints: 1, bad: 'x' },
          },
        },
      ],
    });
    expect(out?.storeSlots?.[0]?.item).toEqual({
      name: 'Helm',
      type: 'ARMOR',
      price: 5,
      statistics: { strongPoints: 2, agilityPoints: 1 },
    });
  });
});

describe('mapWearableItemFromApi', () => {
  it('returns null for non-objects', () => {
    expect(mapWearableItemFromApi(null)).toBeNull();
    expect(mapWearableItemFromApi('x')).toBeNull();
  });

  it('returns empty object for empty record', () => {
    expect(mapWearableItemFromApi({})).toEqual({});
  });

  it('maps upgrade workshop fields when present', () => {
    expect(
      mapWearableItemFromApi({
        name: 'Helm',
        type: 'HELMET',
        price: 50,
        upgradeLevel: 2,
        maxUpgradeLevel: 3,
        nextUpgradeCost: 300,
      })
    ).toEqual({
      name: 'Helm',
      type: 'HELMET',
      price: 50,
      upgradeLevel: 2,
      maxUpgradeLevel: 3,
      nextUpgradeCost: 300,
    });
  });

  it('maps null nextUpgradeCost at max level', () => {
    expect(
      mapWearableItemFromApi({
        name: 'Helm',
        type: 'HELMET',
        price: 50,
        upgradeLevel: 3,
        maxUpgradeLevel: 3,
        nextUpgradeCost: null,
      })
    ).toEqual({
      name: 'Helm',
      type: 'HELMET',
      price: 50,
      upgradeLevel: 3,
      maxUpgradeLevel: 3,
      nextUpgradeCost: null,
    });
  });
});
