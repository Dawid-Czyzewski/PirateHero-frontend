"use client";

import { CharacterSheetScreen } from "@/components/character/sheet/CharacterSheetScreen";
import { CharacterSheetSkeleton } from "@/components/character/sheet/CharacterSheetSkeleton";
import { ErrorScreen } from "@/components/game/ScreenStatus";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";

export function CharacterSheetView() {
  const { state, retry } = useCharacterSheetSession();

  if (state.kind === "loaded") return <CharacterSheetScreen character={state.character} />;
  if (state.kind === "unavailable") return <ErrorScreen message="Nie udało się wczytać zawodnika." onRetry={retry} />;
  return <CharacterSheetSkeleton />;
}
