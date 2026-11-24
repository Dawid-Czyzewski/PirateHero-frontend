import { GameIcon } from "@/components/game/GameIcon";
import { ProgressBar } from "@/components/game/ProgressBar";
import { formatCountdown, type RegenPool } from "@/modules/character/regenPool";

type PoolPanelProps = {
  label: string;
  iconSrc: string;
  pool: RegenPool;
  fullText: string;
};

const POOL_FILL = "bg-[linear-gradient(90deg,#b8860b,var(--color-gold))]";

function regenerationText(nextPointInSeconds: number | null, fullText: string): string {
  return nextPointInSeconds === null ? fullText : `Następny punkt za ${formatCountdown(nextPointInSeconds)}`;
}

export function PoolPanel({ label, iconSrc, pool, fullText }: PoolPanelProps) {
  return (
    <section className="fl-card flex min-w-0 items-center gap-3 px-3 py-3 desk:px-5" aria-label={label}>
      <GameIcon src={iconSrc} size={36} />
      <div className="grid min-w-0 flex-1 gap-1.5">
        <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-2 font-cond font-bold tracking-[.06em] uppercase">
          <span className="text-sm text-gold">{label}</span>
          <span className="text-sm text-[#f3eadb] tabular-nums" role="timer">
            {regenerationText(pool.nextPointInSeconds, fullText)}
          </span>
        </p>
        <ProgressBar
          label={`${label}: ${pool.current} z ${pool.max}`}
          value={pool.current}
          max={pool.max}
          fillClassName={POOL_FILL}
          caption={`${pool.current}/${pool.max}`}
          className="h-5"
        />
      </div>
    </section>
  );
}
