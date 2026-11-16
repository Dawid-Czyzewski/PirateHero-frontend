import type { AppearancePart } from "@/modules/character/appearance";

export const VARIANT_NAMES: Record<AppearancePart, readonly string[]> = {
  face: ["Zakapior", "Luzak", "Wściekły", "Cwaniak", "Zimny drań", "Wesołek", "Bandzior", "Po przejściach"],
  hair: ["Na łyso", "Na jeża", "Irokez", "Grzywka w bok", "Kok wojownika", "Afro", "Długie pióra", "Zaczes do tyłu"],
  beard: [
    "Gładko",
    "Wąsy",
    "Kozia bródka",
    "Trzydniowy zarost",
    "Pełna broda",
    "Broda drwala",
    "Bokobrody",
    "Podkowa",
  ],
  tattoo: [
    "Czysta skóra",
    "Łza pod okiem",
    "Kreski na szyi",
    "Gwiazda na klatce",
    "Skrzydła",
    "Tribal na skroni",
    "Drut na szyi",
    "Dwa iksy",
  ],
  skin: ["Blada", "Jasna", "Opalona", "Śniada", "Ciemna"],
};

export function variantName(part: AppearancePart, variant: number): string {
  const name = VARIANT_NAMES[part][variant];
  if (name === undefined) throw new RangeError(`Unknown ${part} variant: ${variant}`);
  return name;
}
