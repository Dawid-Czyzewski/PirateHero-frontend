import { describeAppearance, type Appearance } from "@/modules/character/appearance";

export function avatarLabel(appearance: Appearance): string {
  return `Podgląd zawodnika: ${describeAppearance(appearance)}`;
}
