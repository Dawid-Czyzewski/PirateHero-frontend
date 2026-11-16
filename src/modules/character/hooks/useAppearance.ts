"use client";

import { useState } from "react";
import {
  APPEARANCE_PARTS,
  DEFAULT_APPEARANCE,
  randomAppearance,
  withVariant,
  type Appearance,
  type AppearancePart,
  type RandomInt,
} from "@/modules/character/appearance";

export type AppearanceEditor = {
  appearance: Appearance;
  activePart: AppearancePart;
  selectPart: (part: AppearancePart) => void;
  choose: (part: AppearancePart, variant: number) => void;
  rolls: number;
  randomize: () => void;
};

export function useAppearance(randomInt?: RandomInt): AppearanceEditor {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [activePart, setActivePart] = useState<AppearancePart>(APPEARANCE_PARTS[0].part);
  const [rolls, setRolls] = useState(0);

  return {
    appearance,
    activePart,
    selectPart: setActivePart,
    choose: (part, variant) => setAppearance((current) => withVariant(current, part, variant)),
    rolls,
    randomize: () => {
      setAppearance((current) => randomAppearance(randomInt, current));
      setRolls((count) => count + 1);
    },
  };
}
