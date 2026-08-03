import type { TFunction } from 'i18next';
import type { GameItem } from '@/features/game/character/characterTypes';

type WearableLike = Pick<GameItem, 'id' | 'publicCode'> & {
  nameKey?: string;
  displayName?: string;
};

function normalizeItemsNameKey(raw: string): string {
  if (raw.startsWith('characterPage.items.')) {
    return `items.${raw.slice('characterPage.items.'.length)}`;
  }
  if (raw.startsWith('storePage.items.')) {
    return `items.${raw.slice('storePage.items.'.length)}`;
  }
  return raw;
}

export function translateWearableItemName(t: TFunction, item: WearableLike): string {
  const nk = typeof item.nameKey === 'string' ? item.nameKey.trim() : '';
  if (nk) {
    const key = normalizeItemsNameKey(nk);
    if (key.includes('.')) {
      return String(t(key));
    }
    return String(t(`items.${key}`));
  }
  const pc = typeof item.publicCode === 'string' ? item.publicCode.trim() : '';
  if (pc && !/^\d+$/.test(pc)) {
    return String(t(`items.${pc}`));
  }
  const dn = typeof item.displayName === 'string' ? item.displayName.trim() : '';
  if (dn) return dn;
  return String(t('items.genericLoot'));
}

export function translateWearableItemFlavor(t: TFunction, nameKey: string | undefined): string {
  const nk = typeof nameKey === 'string' ? nameKey.trim() : '';
  if (!nk) return '';
  const key = normalizeItemsNameKey(nk);
  const flavorKey = key.includes('.') ? `${key}Flavor` : `items.${key}Flavor`;
  const flavor = String(t(flavorKey, { defaultValue: '' }));
  return flavor === flavorKey ? '' : flavor;
}
