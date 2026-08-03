import type { TFunction } from 'i18next';
import type { AvailableWorkDto } from '@/types/gameActivities';
import type { FrontendWork } from '@/features/game/works/workTypes';

export function calculateWorkRawBaseGold(work: AvailableWorkDto, userLevel: number): number {
  const level = Math.max(1, Math.floor(userLevel) || 1);
  const hours = Math.max(0, Number(work.hoursCount ?? 0));
  const base = Number(work.baseGold ?? 0);
  return Math.round(base * hours * level);
}

export function workGoldAfterShipModule(rawBase: number, bonusPercent: number): number {
  const raw = Math.max(0, Math.round(Number(rawBase) || 0));
  const L = Math.max(0, Number(bonusPercent) || 0);
  if (raw <= 0) return 0;
  const mult = 1 + L / 100;
  let after = Math.round(raw * mult);
  if (L > 0 && after <= raw) {
    after = raw + 1;
  }
  return after;
}

export function workShipModuleGoldDelta(work: AvailableWorkDto, userLevel: number): number {
  const raw = calculateWorkRawBaseGold(work, userLevel);
  const afterShip = calculateWorkGoldAfterShip(work, userLevel);
  return Math.max(0, afterShip - raw);
}

export function calculateWorkGoldAfterShip(work: AvailableWorkDto, userLevel: number): number {
  const raw = calculateWorkRawBaseGold(work, userLevel);
  const bonusPercent = Number(work.bonusPercent ?? 0);

  if (work.totalGoldAfterShip != null && Number.isFinite(Number(work.totalGoldAfterShip))) {
    let after = Math.round(Number(work.totalGoldAfterShip));
    if (bonusPercent > 0 && raw > 0 && after <= raw) {
      after = raw + 1;
    }
    return after;
  }

  return workGoldAfterShipModule(raw, bonusPercent);
}

export function calculateWorkGoldPreview(work: AvailableWorkDto, userLevel: number): number {
  if (work.totalGoldPreview != null && Number.isFinite(Number(work.totalGoldPreview))) {
    return Math.round(Number(work.totalGoldPreview));
  }
  return calculateWorkGoldAfterShip(work, userLevel);
}

export function availableWorkToFrontendRow(
  dto: AvailableWorkDto,
  t: TFunction,
  userLevel: number
): FrontendWork {
  const hours = Math.max(1, Number(dto.hoursCount ?? 1));
  const durationMs = hours * 3600 * 1000;
  const titleKey = dto.title ?? '';
  return {
    id: String(dto.id ?? ''),
    name: titleKey ? String(t(titleKey)) : '',
    durationLabel: String(t('hours', { count: hours })),
    durationMs,
    goldPreview: calculateWorkGoldPreview(dto, userLevel),
    bonusPercent: Number(dto.bonusPercent ?? 0),
    source: dto,
  };
}
