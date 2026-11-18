import { ProgressBar } from "@/components/game/ProgressBar";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { levelProgressOf } from "@/modules/character/levelProgress";

const XP_FILL = "bg-[linear-gradient(90deg,var(--color-bronze),var(--color-gold),var(--color-gold-light))]";

export function LevelMeter({ level, experience }: Pick<CharacterSheet, "level" | "experience">) {
  const progress = levelProgressOf({ level, experience });
  const missing = `Brakuje ${progress.missing} XP do poziomu ${progress.nextLevel}`;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <p className="m-0 shrink-0 -skew-x-12 bg-blood px-2 py-1 font-cond text-sm leading-none font-bold tracking-[.04em] whitespace-nowrap text-white uppercase shadow-[2px_2px_0_#000] sm:px-3 sm:text-lg">
        <span className="inline-block skew-x-12">Poziom {progress.level}</span>
      </p>
      <div className="min-w-0 flex-1" title={missing}>
        <ProgressBar
          label={`Doświadczenie: ${progress.current} z ${progress.required} XP. ${missing}.`}
          value={progress.current}
          max={progress.required}
          fillClassName={XP_FILL}
          caption={`${progress.current} / ${progress.required} XP`}
          className="h-6"
        />
      </div>
      <p className="m-0 hidden shrink-0 font-semi text-sm font-medium whitespace-nowrap text-[#d8d2c8] xl:block" aria-hidden="true">
        {missing}
      </p>
    </div>
  );
}
