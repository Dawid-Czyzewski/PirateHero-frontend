"use client";

import { StaminaPanel } from "@/components/character/training/StaminaPanel";
import { StatTrainingCard } from "@/components/character/training/StatTrainingCard";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { STATS, type CharacterSheet, type CharacterStats } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { useStaminaCountdown } from "@/modules/character/hooks/useStaminaCountdown";
import { useTraining, type TrainingGain } from "@/modules/character/hooks/useTraining";
import { canAffordTraining, TRAINING_COST, trainingWaitHint } from "@/modules/character/training";

const MAIN = [
  "relative z-1 mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-3 px-3 pt-3 pb-6 sm:px-4",
  "desk:max-w-[min(100%-3rem,72rem)] desk:gap-4 desk:px-0 desk:pt-4",
].join(" ");

const TITLE =
  "m-0 text-center font-marker text-[clamp(2.75rem,13vw,4.5rem)] leading-none text-blood [text-shadow:0_3px_0_#000,0_0_22px_rgb(225_25_45/0.35)]";

function gainAnnouncement(gain: TrainingGain | null, stats: CharacterStats): string {
  if (!gain) return "";
  const label = STATS.find(({ key }) => key === gain.stat)?.label ?? "";
  return `${label}: wzrost do ${stats[gain.stat]}`;
}

export function TrainingScreen({ character }: { character: CharacterSheet }) {
  const { refresh } = useCharacterSheetSession();
  const stamina = useStaminaCountdown(character.stamina, refresh);
  const { pendingStat, lastGain, error, train } = useTraining();
  const affordable = canAffordTraining(stamina);
  const hint = affordable ? null : trainingWaitHint(stamina);

  return (
    <GameScreenShell>
      <main className={MAIN}>
        <h1 className={TITLE}>Trening</h1>
        <p className="m-0 text-center font-cond text-base font-semibold text-white/75">
          Każdy trening kosztuje {TRAINING_COST} Kondychy i podnosi cechę o 1.
        </p>
        <StaminaPanel stamina={stamina} />
        {error ? (
          <p className="m-0 border-l-4 border-blood bg-black/70 px-3 py-2 font-cond text-base font-semibold text-white" role="alert">
            {error}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-4">
          {STATS.map(({ key, label }) => (
            <StatTrainingCard
              key={key}
              stat={key}
              label={label}
              value={character.stats[key]}
              pending={pendingStat === key}
              disabled={pendingStat !== null || !affordable}
              hint={hint}
              gainId={lastGain?.stat === key ? lastGain.id : null}
              onTrain={train}
            />
          ))}
        </div>
        <p className="sr-only" role="status">
          {gainAnnouncement(lastGain, character.stats)}
        </p>
      </main>
    </GameScreenShell>
  );
}
