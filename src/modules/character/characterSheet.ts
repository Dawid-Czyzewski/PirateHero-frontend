import type { Appearance } from "@/modules/character/appearance";

export type StatKey = "strength" | "endurance" | "technique" | "charisma";

export type CurrencyKey = "onions" | "goldTeeth" | "energy" | "reach" | "medals";

export type CharacterStats = Record<StatKey, number>;

export type Wallet = Record<CurrencyKey, number>;

export type CharacterSheet = {
  id: string;
  nick: string;
  level: number;
  maxHp: number;
  stats: CharacterStats;
  wallet: Wallet;
  appearance: Appearance;
};

export const STATS: readonly { key: StatKey; label: string }[] = [
  { key: "strength", label: "Siła" },
  { key: "endurance", label: "Kondycja" },
  { key: "technique", label: "Technika" },
  { key: "charisma", label: "Charyzma" },
];

export const CURRENCIES: readonly { key: CurrencyKey; label: string }[] = [
  { key: "onions", label: "Cebuliony" },
  { key: "goldTeeth", label: "Złote Zęby" },
  { key: "energy", label: "Kondycha" },
  { key: "reach", label: "Zasięgi" },
  { key: "medals", label: "Medale" },
];

export type CurrencyGroup = { id: string; title: string; currencies: readonly CurrencyKey[] };

export const CURRENCY_GROUPS: readonly CurrencyGroup[] = [
  { id: "wallet", title: "Portfel", currencies: ["onions", "goldTeeth"] },
  { id: "resources", title: "Zasoby", currencies: ["energy", "reach", "medals"] },
];

export function currencyLabel(key: CurrencyKey): string {
  return CURRENCIES.find((currency) => currency.key === key)?.label ?? key;
}
