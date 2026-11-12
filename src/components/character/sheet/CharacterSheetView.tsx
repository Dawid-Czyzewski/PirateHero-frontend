"use client";

import { CharacterSheetScreen } from "@/components/character/sheet/CharacterSheetScreen";
import { ErrorScreen, LoadingScreen } from "@/components/game/ScreenStatus";
import { useCharacterSheet } from "@/modules/character/hooks/useCharacterSheet";

export function CharacterSheetView() {
  const { state, retry } = useCharacterSheet();

  if (state.kind === "loaded") return <CharacterSheetScreen character={state.character} />;
  if (state.kind === "unavailable") return <ErrorScreen message="Nie udało się wczytać zawodnika." onRetry={retry} />;
  return <LoadingScreen message="Wczytujemy zawodnika…" />;
}
