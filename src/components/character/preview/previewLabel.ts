import { describeAppearance, type Appearance } from "@/modules/character/appearance";

export function previewLabel(appearance: Appearance): string {
  return `Podgląd zawodnika: ${describeAppearance(appearance)}`;
}
