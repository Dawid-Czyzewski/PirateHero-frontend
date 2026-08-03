import type { TFunction } from 'i18next';
import type { AvailableMissionDto } from '@/types/gameActivities';
import type { FrontendMission } from '@/features/game/missions/missionTypes';
import { readMissionStartBasesSnapshot } from '@/features/game/missions/missionStartBasesStorage';

function pickFiniteBase(
  activityVal: number | undefined,
  listVal: number | undefined,
  snapshotVal: number | undefined
): number | undefined {
  if (snapshotVal != null && Number.isFinite(Number(snapshotVal))) return Number(snapshotVal);
  if (listVal != null && Number.isFinite(Number(listVal))) return Number(listVal);
  return activityVal;
}

export function mergeActiveMissionDtoWithUserMissions(
  activityMission: AvailableMissionDto | undefined,
  missionList: AvailableMissionDto[] | undefined
): AvailableMissionDto | undefined {
  if (!activityMission) return undefined;
  const mid = String(activityMission.id ?? '');
  const fromList = missionList?.find((m) => String(m.id) === mid);
  const snap = readMissionStartBasesSnapshot(mid);
  return {
    ...activityMission,
    baseGoldReward: pickFiniteBase(
      activityMission.baseGoldReward,
      fromList?.baseGoldReward,
      snap?.baseGoldReward
    ),
    baseExpReward: pickFiniteBase(
      activityMission.baseExpReward,
      fromList?.baseExpReward,
      snap?.baseExpReward
    ),
    bonusPercent: activityMission.bonusPercent ?? fromList?.bonusPercent,
    shopBoosterPercent: activityMission.shopBoosterPercent ?? fromList?.shopBoosterPercent,
  };
}

export function formatMissionDurationLabel(durationSeconds: number, t: TFunction): string {
  const sec = Math.max(0, Math.floor(durationSeconds));
  if (sec <= 0) {
    return '-';
  }
  if (sec % 3600 === 0) {
    return t('missionsPage.durationHoursShort', { count: sec / 3600 });
  }
  const minutes = Math.round(sec / 60);
  return t('missionsPage.durationMinutesShort', { count: minutes });
}

export function missionDescriptionKey(titleKey: string): string {
  return titleKey ? `${titleKey}_desc` : '';
}

export function availableMissionToFrontendRow(
  dto: AvailableMissionDto,
  t: TFunction
): FrontendMission {
  const sec = Math.max(0, Number(dto.durationInSeconds ?? 0));
  const titleKey = dto.title ?? '';
  const descKey = missionDescriptionKey(titleKey);
  const description = descKey ? String(t(descKey)) : '';
  return {
    id: String(dto.id ?? ''),
    name: titleKey ? String(t(titleKey)) : '',
    description: description !== descKey ? description : '',
    durationLabel: formatMissionDurationLabel(sec, t),
    durationMs: sec * 1000,
    xp: Math.round(Number(dto.expReward ?? 0)),
    gold: Math.round(Number(dto.goldReward ?? 0)),
    energy: Number(dto.energyCost ?? 0),
  };
}
