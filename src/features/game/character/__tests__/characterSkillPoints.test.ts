import { describe, expect, it } from 'vitest';
import {
  CHARACTER_ATTRIBUTE_API_STAT,
  CHARACTER_STAT_KEYS,
  resolveAttributePointPrice,
} from '@/features/game/character/characterSkillPoints';

describe('characterSkillPoints', () => {
  it('exposes API stat names aligned with backend UserStatType', () => {
    expect(CHARACTER_ATTRIBUTE_API_STAT.strength).toBe('STRENGTH');
    expect(CHARACTER_ATTRIBUTE_API_STAT.intelligence).toBe('INTELLIGENCE');
    expect(CHARACTER_ATTRIBUTE_API_STAT.endurance).toBe('ENDURANCE');
    expect(CHARACTER_ATTRIBUTE_API_STAT.luck).toBe('LUCK');
    expect(CHARACTER_STAT_KEYS).toContain('intelligence');
    expect(CHARACTER_STAT_KEYS).toContain('endurance');
    expect(CHARACTER_STAT_KEYS).not.toContain('criticalChance' as never);
  });

  it('resolveAttributePointPrice prefers canonical price fields', () => {
    expect(
      resolveAttributePointPrice(
        { intelligencePointsPrice: 12, strengthPointsPrice: 7 } as Record<string, number>,
        'intelligence'
      )
    ).toBe(12);
  });

  it('resolveAttributePointPrice falls back to legacy serialized keys', () => {
    expect(
      resolveAttributePointPrice({ criticalChancePointsPrice: 9 } as Record<string, number>, 'intelligence')
    ).toBe(9);
    expect(
      resolveAttributePointPrice({ strongPointsPrice: 8 } as Record<string, number>, 'strength')
    ).toBe(8);
  });

  it('resolveAttributePointPrice defaults when field missing or invalid', () => {
    expect(resolveAttributePointPrice({}, 'agility')).toBe(5);
    expect(resolveAttributePointPrice({ agilityPointsPrice: 0 }, 'agility')).toBe(5);
  });
});
