import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  equipCompanion,
  feedCompanion,
  fetchCompanionStatus,
  unequipCompanion,
  useCompanionAbility,
} from '@/services/companionService';

vi.mock('@/lib/api/requestJson', () => ({
  requestJson: vi.fn(),
}));

import { requestJson } from '@/lib/api/requestJson';

const mockedRequestJson = vi.mocked(requestJson);

const emptyStatus = {
  companions: [],
  equippedCode: null,
  abilityReady: false,
  canFeed: false,
  unclaimedCount: 0,
};

describe('companionService', () => {
  beforeEach(() => {
    mockedRequestJson.mockReset();
  });

  it('fetches status', async () => {
    mockedRequestJson.mockResolvedValueOnce(emptyStatus);
    await fetchCompanionStatus();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/companion/status', { method: 'GET' });
  });

  it('feeds companion', async () => {
    mockedRequestJson.mockResolvedValueOnce(emptyStatus);
    await feedCompanion('parrot');
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/companion/feed', {
      method: 'POST',
      body: { companionCode: 'parrot' },
    });
  });

  it('equips companion', async () => {
    mockedRequestJson.mockResolvedValueOnce({ equipped: true, equippedCode: 'parrot' });
    await equipCompanion('parrot');
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/companion/equip', {
      method: 'POST',
      body: { companionCode: 'parrot' },
    });
  });

  it('unequips companion', async () => {
    mockedRequestJson.mockResolvedValueOnce({ equipped: false, equippedCode: null });
    await unequipCompanion();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/companion/unequip', {
      method: 'POST',
    });
  });

  it('uses ability', async () => {
    mockedRequestJson.mockResolvedValueOnce(emptyStatus);
    await useCompanionAbility();
    expect(mockedRequestJson).toHaveBeenCalledWith('/users/companion/ability', {
      method: 'POST',
    });
  });
});
