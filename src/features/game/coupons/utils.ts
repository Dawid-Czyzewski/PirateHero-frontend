import type { TFunction } from 'i18next';
import type { CouponRewardDto } from '@/types/coupon';

function itemRarityToKey(rarity: string | { value?: string } | undefined): string {
  if (rarity == null || rarity === '') return '';
  if (typeof rarity === 'string') return rarity;
  return String(rarity.value ?? '');
}

export function formatReward(
  reward: CouponRewardDto | null | undefined,
  t: TFunction
): string {
  if (!reward) return '-';

  switch (reward.type) {
    case 'GOLD':
      return `${reward.amount} ${t('gold')}`;
    case 'diamonds':
      return `${reward.amount} ${t('diamonds')}`;
    case 'BOOSTER': {
      const boosterName = reward.boosterName
        ? (() => {
            const translated = t(reward.boosterName);
            return translated !== reward.boosterName ? translated : reward.boosterName;
          })()
        : t('boosters');
      return `${boosterName} (${reward.durationDays || 7} ${t('days')})`;
    }
    case 'ITEM': {
      let rarityTranslated = '';
      const rarityValue = itemRarityToKey(reward.rarity);
      if (rarityValue) {
        rarityTranslated = t(`item.rarities.${rarityValue}`, String(rarityValue));
      }
      const itemTypeLabel = rarityTranslated ? `${rarityTranslated} ${t('itemLabel')}` : t('itemLabel');
      return itemTypeLabel;
    }
    default:
      return String((reward as { type?: string }).type ?? '');
  }
}

export function formatRewardDescription(reward: CouponRewardDto | null | undefined, t: TFunction): string {
  if (!reward) return '';

  switch (reward.type) {
    case 'GOLD':
      return `${reward.amount} ${t('gold')}`;
    case 'diamonds':
      return `${reward.amount} ${t('diamonds')}`;
    case 'BOOSTER': {
      const boosterTranslationKey = reward.boosterName;
      const boosterNameTranslated = boosterTranslationKey
        ? t(boosterTranslationKey, boosterTranslationKey)
        : t('boosters');
      return `${boosterNameTranslated} (${reward.durationDays || 7} ${t('days')})`;
    }
    case 'ITEM': {
      const rarityValueItem = itemRarityToKey(reward.rarity);
      const rarityTranslatedItem = rarityValueItem
        ? t(`item.rarities.${rarityValueItem}`, String(rarityValueItem))
        : '';
      return rarityTranslatedItem ? `${rarityTranslatedItem} ${t('itemLabel')}` : t('itemLabel');
    }
    default:
      return getRewardTypeLabel((reward as { type?: string }).type, t);
  }
}

export function getRewardTypeLabel(type: string | undefined, t: TFunction): string {
  switch (type) {
    case 'GOLD':
      return t('gold');
    case 'diamonds':
      return t('diamonds');
    case 'BOOSTER':
      return t('boosters');
    case 'ITEM':
      return t('itemLabel');
    default:
      return type ?? '';
  }
}
