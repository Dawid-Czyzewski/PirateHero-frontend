import type { TFunction } from 'i18next';
import type { AvailableTrainingListItemDto } from '@/types/gameActivities';
import type { FrontendTraining } from '@/features/game/trainings/trainingTypes';
import { formatMissionDurationLabel } from '@/features/game/missions/missionDisplay';


export function statTypeToTranslationKey(statType: string | null | undefined): string | null {
  switch (statType) {
    case 'STRENGTH':
      return 'strength';
    case 'AGILITY':
      return 'agility';
    case 'INTELLIGENCE':
      return 'intelligence';
    case 'ENDURANCE':
      return 'endurance';
    case 'LUCK':
      return 'luck';
    case 'CRITICAL_CHANCE':
      return 'intelligence';
    case 'HEALTH':
      return 'endurance';
    default:
      return null;
  }
}

export function availableTrainingToFrontendRow(
  dto: AvailableTrainingListItemDto,
  t: TFunction
): FrontendTraining {
  const sec = Math.max(0, Number(dto.durationInSeconds ?? 0));
  const titleKey = dto.title ?? '';
  return {
    id: String(dto.id ?? ''),
    name: titleKey ? String(t(titleKey)) : '',
    durationLabel: formatMissionDurationLabel(sec, t),
    durationMs: sec * 1000,
    trainingPointsCost: Number(dto.trainingPointsCost ?? 0),
    skillPointsReward: Math.round(Number(dto.skillPointsReward ?? 0)),
    statTranslationKey: statTypeToTranslationKey(dto.statType),
  };
}
