"use client";

import { useState } from "react";
import {
  APPEARANCE_PARTS,
  DEFAULT_APPEARANCE,
  randomAppearance,
  stepVariant,
  withVariant,
  type Appearance,
  type AppearancePart,
  type RandomInt,
  type Step,
} from "@/modules/character/appearance";

export type AppearanceEditor = {
  appearance: Appearance;
  activePart: AppearancePart;
  selectPart: (part: AppearancePart) => void;
  step: (part: AppearancePart, step: Step) => void;
  choose: (part: AppearancePart, variant: number) => void;
  randomize: () => void;
};

export function useAppearance(randomInt?: RandomInt): AppearanceEditor {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [activePart, setActivePart] = useState<AppearancePart>(APPEARANCE_PARTS[0].part);

  return {
    appearance,
    activePart,
    selectPart: setActivePart,
    step: (part, direction) => setAppearance((current) => stepVariant(current, part, direction)),
    choose: (part, variant) => setAppearance((current) => withVariant(current, part, variant)),
    randomize: () => setAppearance(randomAppearance(randomInt)),
  };
}
