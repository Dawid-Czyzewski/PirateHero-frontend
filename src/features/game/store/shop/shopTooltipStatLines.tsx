import type { TFunction } from 'i18next';
import type { ItemStats } from '@/features/game/character/characterTypes';
import { statColors, statIcons } from '@/features/game/character/characterPageConfig';
export function aggregateShopStatLines(lines: { statId: string; value: number }[]): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const { statId, value } of lines) {
    acc[statId] = (acc[statId] ?? 0) + value;
  }
  return acc;
}

function iconKeyForShopStatId(statId: string): keyof ItemStats {
  if (statId === 'strength') return 'strength';
  if (statId === 'agility' || statId === 'speed') return 'agility';
  if (statId === 'health' || statId === 'defense') return 'endurance';
  if (statId === 'intelligence') return 'intelligence';
  if (statId === 'luck') return 'luck';
  return 'agility';
}

export function shopStatLineLabel(statId: string, t: TFunction): string {
  if (statId === 'luck') {
    return t('characterPage.stats.luck');
  }
  if (statId === 'intelligence') {
    return t('characterPage.stats.intelligence');
  }
  const k = `storePage.stats.${statId}`;
  const tr = t(k);
  return tr !== k ? tr : statId;
}

export function shopStatLineIcon(statId: string) {
  const key = iconKeyForShopStatId(statId);
  return { Icon: statIcons[key], color: statColors[key] };
}

export type ShopTooltipStatRow = {
  statId: string;
  value: number;
  compared: number;
};

export function buildShopTooltipStatRows(
  itemLines: { statId: string; value: number }[],
  comparedLines: { statId: string; value: number }[] | null
): ShopTooltipStatRow[] {
  const a = aggregateShopStatLines(itemLines);
  const b = comparedLines ? aggregateShopStatLines(comparedLines) : null;
  const order: string[] = ['strength', 'agility', 'speed', 'health', 'defense', 'intelligence', 'luck'];
  const ids = new Set<string>([...Object.keys(a), ...(b ? Object.keys(b) : [])]);
  const rest = [...ids].filter((id) => !order.includes(id));
  const sorted = [...order.filter((id) => ids.has(id)), ...rest.sort()];
  return sorted.map((statId) => ({
    statId,
    value: a[statId] ?? 0,
    compared: b?.[statId] ?? 0,
  }));
}
