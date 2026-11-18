import type { CharacterSheet } from "@/modules/character/characterSheet";

export type LevelProgress = {
  level: number;
  nextLevel: number;
  current: number;
  required: number;
  missing: number;
};

export function levelProgressOf({ level, experience }: Pick<CharacterSheet, "level" | "experience">): LevelProgress {
  return {
    level,
    nextLevel: level + 1,
    current: experience.current,
    required: experience.required,
    missing: experience.required - experience.current,
  };
}
