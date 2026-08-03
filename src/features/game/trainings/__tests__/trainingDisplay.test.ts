import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';
import {
  availableTrainingToFrontendRow,
  statTypeToTranslationKey,
} from '@/features/game/trainings/trainingDisplay';

const t = ((key: string, options?: { count?: number }) => {
  if (key === 'missionsPage.durationMinutesShort') return `${options?.count} min`;
  if (key === 't_title') return 'Tytuł';
  return key;
}) as TFunction;

describe('statTypeToTranslationKey', () => {
  it('maps backend stat types to i18n keys', () => {
    expect(statTypeToTranslationKey('STRENGTH')).toBe('strength');
    expect(statTypeToTranslationKey('INTELLIGENCE')).toBe('intelligence');
    expect(statTypeToTranslationKey('AGILITY')).toBe('agility');
    expect(statTypeToTranslationKey('UNKNOWN')).toBeNull();
  });
});

describe('availableTrainingToFrontendRow', () => {
  it('maps DTO to frontend row for list UI', () => {
    const row = availableTrainingToFrontendRow(
      {
        id: 3,
        title: 't_title',
        description: 'ignored',
        durationInSeconds: 300,
        trainingPointsCost: 5,
        skillPointsReward: 2,
        statType: 'STRENGTH',
      },
      t
    );
    expect(row.id).toBe('3');
    expect(row.name).toBe('Tytuł');
    expect(row.durationLabel).toBe('5 min');
    expect(row.trainingPointsCost).toBe(5);
    expect(row.skillPointsReward).toBe(2);
    expect(row.statTranslationKey).toBe('strength');
  });
});
