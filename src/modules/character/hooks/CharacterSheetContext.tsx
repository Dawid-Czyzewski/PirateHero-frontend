"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCharacterSheet, type CharacterSheetSession } from "@/modules/character/hooks/useCharacterSheet";

const CharacterSheetContext = createContext<CharacterSheetSession | null>(null);

export function CharacterSheetProvider({ children }: { children: ReactNode }) {
  const session = useCharacterSheet();
  return <CharacterSheetContext.Provider value={session}>{children}</CharacterSheetContext.Provider>;
}

export function useCharacterSheetSession(): CharacterSheetSession {
  const session = useContext(CharacterSheetContext);
  if (!session) throw new Error("useCharacterSheetSession must be used inside CharacterSheetProvider");
  return session;
}
