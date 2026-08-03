import type { TFunction } from 'i18next';
import { UPGRADE_KEYS } from '@/features/game/ship/shipConstants';

export type ShipUpgradeKey = (typeof UPGRADE_KEYS)[number]['key'];

export function shipUpgradeCurrentEffect(
  t: TFunction,
  upgradeKey: ShipUpgradeKey,
  level: number,
  crewBaseSlots: number
): string {
  if (upgradeKey === 'hull') {
    if (level <= 0) {
      return t('shipPage.upgrades.hull.effectZero', { base: crewBaseSlots });
    }
    const slots = crewBaseSlots + level;
    return t('shipPage.upgrades.hull.effectCurrent', { count: slots, base: crewBaseSlots, level });
  }
  if (level <= 0) {
    return t(`shipPage.upgrades.${upgradeKey}.effectZero`);
  }
  if (upgradeKey === 'skills') {
    return t('shipPage.upgrades.skills.effectCurrent', { level });
  }
  if (upgradeKey === 'work') {
    return t('shipPage.upgrades.work.effectCurrent', { level });
  }
  return t('shipPage.upgrades.quests.effectCurrent', { level });
}
