import type { TFunction } from 'i18next';
import type { ShopBoosterDefinition } from './shopBoosterCatalog';

export function shopBoosterName(t: TFunction, booster: Pick<ShopBoosterDefinition, 'name'>): string {
  return t(booster.name, { defaultValue: booster.name });
}

export function shopBoosterDescription(t: TFunction, booster: Pick<ShopBoosterDefinition, 'description'>): string {
  return t(booster.description, { defaultValue: booster.description });
}

export function shopBoosterEffectLabel(t: TFunction, booster: ShopBoosterDefinition): string {
  const key = `shopBooster.catalog.${booster.id}.effect`;
  return t(key, { defaultValue: booster.effect });
}
