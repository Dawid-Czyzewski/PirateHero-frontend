"use client";

import { OctagonScreen } from "@/components/combat/OctagonScreen";
import { ErrorScreen, LoadingScreen } from "@/components/game/ScreenStatus";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";

export function OctagonView() {
  const { state, retry } = useCharacterSheetSession();

  if (state.kind === "loaded") return <OctagonScreen character={state.character} />;
  if (state.kind === "unavailable") return <ErrorScreen message="Nie udało się wczytać zawodnika." onRetry={retry} />;
  return <LoadingScreen message="Wchodzimy do oktagonu…" />;
}
