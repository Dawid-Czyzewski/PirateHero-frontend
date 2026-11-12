import type { Appearance } from "@/modules/character/appearance";

export type StatKey = "strength" | "endurance" | "technique" | "charisma";

export type CurrencyKey = "cebuliony" | "zloteZeby" | "kondycha" | "zasiegi" | "medale";

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
  { key: "cebuliony", label: "Cebuliony" },
  { key: "zloteZeby", label: "Złote Zęby" },
  { key: "kondycha", label: "Kondycha" },
  { key: "zasiegi", label: "Zasięgi" },
  { key: "medale", label: "Medale" },
];
