"use client";

import { StaminaPanel } from "@/components/character/training/StaminaPanel";
import { StatTrainingCard } from "@/components/character/training/StatTrainingCard";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { ImageTitle } from "@/components/game/ImageTitle";
import { ScreenAlert } from "@/components/game/ScreenAlert";
import { ScreenMain } from "@/components/game/ScreenMain";
import { STATS, type CharacterSheet, type CharacterStats } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { useStaminaCountdown } from "@/modules/character/hooks/useStaminaCountdown";
import { useTraining, type TrainingGain } from "@/modules/character/hooks/useTraining";
import { TRAINING_HEADER } from "@/modules/character/layerAssets";
import { canAffordTraining, TRAINING_COST, trainingWaitHint } from "@/modules/character/training";

const TITLE_SIZE = "w-[min(100%,15rem)] desk:w-[min(100%,20rem)]";

function gainAnnouncement(gain: TrainingGain | null, stats: CharacterStats): string {
  if (!gain) return "";
  const label = STATS.find(({ key }) => key === gain.stat)?.label ?? "";
  return `${label}: wzrost do ${stats[gain.stat]}`;
}

export function TrainingScreen({ character }: { character: CharacterSheet }) {
  const { refresh } = useCharacterSheetSession();
  const stamina = useStaminaCountdown(character.stamina, refresh);
  const { lastGain, error, train } = useTraining();
  const affordable = canAffordTraining(stamina);
  const hint = affordable ? null : trainingWaitHint(stamina);

  return (
    <GameScreenShell>
      <ScreenMain>
        <h1 className="m-0">
          <ImageTitle label="Trening" art={TRAINING_HEADER} className={TITLE_SIZE} />
        </h1>
        <p className="m-0 text-center font-cond text-base font-semibold text-white/75">
          Każdy trening kosztuje {TRAINING_COST} Kondychy i podnosi cechę o 1.
        </p>
        <StaminaPanel stamina={stamina} />
        {error ? <ScreenAlert>{error}</ScreenAlert> : null}
        <div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-4">
          {STATS.map(({ key, label }) => (
            <StatTrainingCard
              key={key}
              stat={key}
              label={label}
              value={character.stats[key]}
              disabled={!affordable}
              hint={hint}
              gainId={lastGain?.stat === key ? lastGain.id : null}
              onTrain={train}
            />
          ))}
        </div>
        <p className="sr-only" role="status">
          {gainAnnouncement(lastGain, character.stats)}
        </p>
      </ScreenMain>
    </GameScreenShell>
  );
}
