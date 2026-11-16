import { VARIANT_NAMES, variantName } from "@/modules/character/variantNames";

export type AppearancePart = "face" | "hair" | "beard" | "skin" | "tattoo";

export type Appearance = Record<AppearancePart, number>;

export type PartDefinition = {
  part: AppearancePart;
  label: string;
  variants: number;
};

export type Step = 1 | -1;

export type RandomInt = (maxExclusive: number) => number;

function definition(part: AppearancePart, label: string): PartDefinition {
  return { part, label, variants: VARIANT_NAMES[part].length };
}

export const APPEARANCE_PARTS: readonly PartDefinition[] = [
  definition("face", "Twarz"),
  definition("hair", "Włosy"),
  definition("beard", "Broda"),
  definition("tattoo", "Tatuaż"),
  definition("skin", "Skóra"),
];

export const DEFAULT_APPEARANCE: Appearance = {
  face: 0,
  hair: 0,
  beard: 0,
  skin: 0,
  tattoo: 0,
};

export function variantCount(part: AppearancePart): number {
  return VARIANT_NAMES[part].length;
}

export function isValidVariant(part: AppearancePart, variant: number): boolean {
  return Number.isInteger(variant) && variant >= 0 && variant < variantCount(part);
}

export function withVariant(appearance: Appearance, part: AppearancePart, variant: number): Appearance {
  if (!isValidVariant(part, variant)) return appearance;
  return { ...appearance, [part]: variant };
}

function wrapped(index: number, step: Step, count: number): number {
  return (index + step + count) % count;
}

export function steppedVariant(part: AppearancePart, variant: number, step: Step): number {
  return wrapped(variant, step, variantCount(part));
}

export function partIndex(part: AppearancePart): number {
  return APPEARANCE_PARTS.findIndex((definition) => definition.part === part);
}

export function steppedPart(part: AppearancePart, step: Step): AppearancePart {
  return APPEARANCE_PARTS[wrapped(partIndex(part), step, APPEARANCE_PARTS.length)].part;
}

export function describeAppearance(appearance: Appearance): string {
  return APPEARANCE_PARTS.map(({ part, label }) => `${label.toLowerCase()}: ${variantName(part, appearance[part])}`).join(", ");
}

export const mathRandomInt: RandomInt = (maxExclusive) => Math.floor(Math.random() * maxExclusive);

export function appearanceEquals(left: Appearance, right: Appearance): boolean {
  return APPEARANCE_PARTS.every(({ part }) => left[part] === right[part]);
}

function rollAppearance(randomInt: RandomInt): Appearance {
  return APPEARANCE_PARTS.reduce<Appearance>(
    (appearance, { part, variants }) => withVariant(appearance, part, randomInt(variants)),
    { ...DEFAULT_APPEARANCE },
  );
}

function nudgeDifferent(previous: Appearance): Appearance {
  const { part, variants } = APPEARANCE_PARTS[0];
  return withVariant(previous, part, (previous[part] + 1) % variants);
}

export function randomAppearance(
  randomInt: RandomInt = mathRandomInt,
  previous?: Appearance,
): Appearance {
  let next = rollAppearance(randomInt);
  if (!previous || !appearanceEquals(next, previous)) return next;

  for (let attempt = 0; attempt < 24; attempt++) {
    next = rollAppearance(randomInt);
    if (!appearanceEquals(next, previous)) return next;
  }

  return nudgeDifferent(previous);
}
