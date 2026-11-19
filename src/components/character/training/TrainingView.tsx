"use client";

import { TrainingScreen } from "@/components/character/training/TrainingScreen";
import { ErrorScreen, LoadingScreen } from "@/components/game/ScreenStatus";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";

export function TrainingView() {
  const { state, retry } = useCharacterSheetSession();

  if (state.kind === "loaded") return <TrainingScreen character={state.character} />;
  if (state.kind === "unavailable") return <ErrorScreen message="Nie udało się wczytać zawodnika." onRetry={retry} />;
  return <LoadingScreen message="Rozgrzewka przed treningiem…" />;
}
