import type { Appearance } from "@/modules/character/appearance";
import type { RegenPool } from "@/modules/character/regenPool";

export type StatKey = "strength" | "endurance" | "technique" | "charisma";

export type CurrencyKey = "onions" | "goldTeeth" | "reach" | "medals";

export type CharacterStats = Record<StatKey, number>;

export type Wallet = Record<CurrencyKey, number>;

export type Experience = { current: number; required: number };


export type CharacterSheet = {
  id: string;
  nick: string;
  level: number;
  maxHp: number;
  experience: Experience;
  stamina: RegenPool;
  fightPoints: RegenPool;
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
  { key: "reach", label: "Zasięgi" },
  { key: "medals", label: "Medale" },
];

export type CurrencyGroup = { id: string; title: string; currencies: readonly CurrencyKey[] };

export const WALLET_GROUP: CurrencyGroup = { id: "wallet", title: "Portfel", currencies: ["onions", "goldTeeth"] };

export const RESOURCES_GROUP: CurrencyGroup = { id: "resources", title: "Zasoby", currencies: ["reach", "medals"] };

export const STAMINA_LABEL = "Kondycha";

export const FIGHT_POINTS_LABEL = "Punkty walki";

export function currencyLabel(key: CurrencyKey): string {
  return CURRENCIES.find((currency) => currency.key === key)?.label ?? key;
}
