export type AppearancePart = "face" | "hair" | "beard" | "skin" | "tattoo";

export type Appearance = Record<AppearancePart, number>;

export type PartDefinition = {
  part: AppearancePart;
  label: string;
  variants: number;
};

export type Step = 1 | -1;

export type RandomInt = (maxExclusive: number) => number;

const STANDARD_VARIANTS = 8;
const SKIN_VARIANTS = 5;

export const APPEARANCE_PARTS: readonly PartDefinition[] = [
  { part: "face", label: "Twarz", variants: STANDARD_VARIANTS },
  { part: "hair", label: "Włosy", variants: STANDARD_VARIANTS },
  { part: "beard", label: "Zarost", variants: STANDARD_VARIANTS },
  { part: "skin", label: "Skóra", variants: SKIN_VARIANTS },
  { part: "tattoo", label: "Tatuaż", variants: STANDARD_VARIANTS },
];

export const DEFAULT_APPEARANCE: Appearance = {
  face: 0,
  hair: 0,
  beard: 0,
  skin: 0,
  tattoo: 0,
};

function partDefinition(part: AppearancePart): PartDefinition {
  const definition = APPEARANCE_PARTS.find((candidate) => candidate.part === part);
  if (!definition) throw new RangeError(`Unknown appearance part: ${part}`);
  return definition;
}

export function variantCount(part: AppearancePart): number {
  return partDefinition(part).variants;
}

export function isValidVariant(part: AppearancePart, variant: number): boolean {
  return Number.isInteger(variant) && variant >= 0 && variant < variantCount(part);
}

export function withVariant(appearance: Appearance, part: AppearancePart, variant: number): Appearance {
  if (!isValidVariant(part, variant)) return appearance;
  return { ...appearance, [part]: variant };
}

export function stepVariant(appearance: Appearance, part: AppearancePart, step: Step): Appearance {
  const count = variantCount(part);
  return withVariant(appearance, part, (appearance[part] + step + count) % count);
}

export function variantPosition(appearance: Appearance, part: AppearancePart): string {
  return `${appearance[part] + 1}/${variantCount(part)}`;
}

export const mathRandomInt: RandomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

export function randomAppearance(randomInt: RandomInt = mathRandomInt): Appearance {
  return APPEARANCE_PARTS.reduce<Appearance>(
    (appearance, { part, variants }) => withVariant(appearance, part, randomInt(variants)),
    DEFAULT_APPEARANCE,
  );
}
