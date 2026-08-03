import { describe, expect, it, vi } from 'vitest';
import type { TFunction } from 'i18next';
import {
  availableWorkToFrontendRow,
  calculateWorkGoldAfterShip,
  calculateWorkGoldPreview,
  calculateWorkRawBaseGold,
  workGoldAfterShipModule,
  workShipModuleGoldDelta,
} from '@/features/game/works/workDisplay';

const t = vi.fn((key: string, opts?: { count?: number }) => {
  if (key === 'hours' && opts?.count != null) return `${opts.count}h`;
  if (key === 'work.test_title') return 'Test job';
  return key;
}) as unknown as TFunction;

describe('workDisplay', () => {
  it('calculateWorkGoldPreview respects level, hours, base and bonus', () => {
    const dto = {
      id: 1,
      title: 'x',
      hoursCount: 2,
      baseGold: 10,
      bonusPercent: 0,
    };
    expect(calculateWorkGoldPreview(dto, 3)).toBe(60);
  });

  it('calculateWorkGoldPreview uses totalGoldPreview when set', () => {
    const dto = {
      id: 1,
      title: 'x',
      totalGoldPreview: 999,
    };
    expect(calculateWorkGoldPreview(dto, 1)).toBe(999);
  });

  it('calculateWorkRawBaseGold ignores ship work module percent', () => {
    const dto = { id: 1, title: 'x', hoursCount: 2, baseGold: 12, bonusPercent: 10 };
    expect(calculateWorkRawBaseGold(dto, 2)).toBe(48);
    expect(calculateWorkGoldAfterShip(dto, 2)).toBe(53);
    expect(workShipModuleGoldDelta(dto, 2)).toBe(5);
  });

  it('workGoldAfterShipModule bumps to base+1 when percent rounds to no gain (like missions)', () => {
    expect(workGoldAfterShipModule(24, 1)).toBe(25);
    expect(workGoldAfterShipModule(24, 0)).toBe(24);
  });

  it('workShipModuleGoldDelta is at least 1 gold when ship bonus percent applies but round is flat', () => {
    const dto = { id: 1, title: 'x', hoursCount: 2, baseGold: 12, bonusPercent: 1 };
    expect(calculateWorkRawBaseGold(dto, 1)).toBe(24);
    expect(calculateWorkGoldAfterShip(dto, 1)).toBe(25);
    expect(workShipModuleGoldDelta(dto, 1)).toBe(1);
  });

  it('calculateWorkGoldAfterShip prefers totalGoldAfterShip from API', () => {
    const dto = {
      id: 1,
      title: 'x',
      totalGoldPreview: 500,
      totalGoldAfterShip: 400,
    };
    expect(calculateWorkGoldAfterShip(dto, 1)).toBe(400);
  });

  it('availableWorkToFrontendRow maps DTO for list UI', () => {
    const row = availableWorkToFrontendRow(
      {
        id: 'a1',
        title: 'work.test_title',
        hoursCount: 3,
        baseGold: 5,
        bonusPercent: 10,
      },
      t,
      2
    );
    expect(row.id).toBe('a1');
    expect(row.name).toBe('Test job');
    expect(row.durationLabel).toBe('3h');
    expect(row.durationMs).toBe(3 * 3600 * 1000);
    expect(row.bonusPercent).toBe(10);
    expect(row.goldPreview).toBeGreaterThan(0);
  });
});
