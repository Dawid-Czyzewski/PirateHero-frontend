import { CharacterAvatar } from "@/components/character/avatar/CharacterAvatar";
import { NpcStats } from "@/components/combat/NpcStats";
import { FIGHT_ACTION_LABEL, FIGHT_COST_LABEL } from "@/modules/combat/fight";
import type { Npc } from "@/modules/combat/npc";

type NpcCardProps = {
  npc: Npc;
  hard: boolean;
  blockedHint: string | null;
  onFight: (npc: Npc) => void;
};

const FIGHT_BUTTON = [
  "min-h-11 w-full -skew-x-12 bg-blood px-4 py-2 font-display text-xl tracking-wider text-white transition",
  "enabled:hover:brightness-110 enabled:active:translate-y-px disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/50",
].join(" ");

export function NpcCard({ npc, hard, blockedHint, onFight }: NpcCardProps) {
  const headingId = `npc-${npc.id}`;
  const hintId = `npc-hint-${npc.id}`;

  return (
    <article className="fl-card flex h-full min-w-0 gap-3 px-3 py-3" aria-labelledby={headingId}>
      <CharacterAvatar appearance={npc.look} className="w-20 shrink-0 self-end sm:w-24" sizes="96px" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 id={headingId} className="m-0 min-w-0 font-cond text-xl leading-tight font-bold tracking-[.06em] text-white uppercase">
            {npc.nick}
          </h3>
          {hard ? (
            <span className="rounded-sm border border-blood/60 bg-blood/15 px-1.5 font-cond text-xs leading-5 font-bold tracking-[.08em] text-[#ff8a95] uppercase">
              Trudny
            </span>
          ) : null}
        </div>
        <p className="m-0 font-cond text-sm font-bold tracking-[.12em] text-gold uppercase">Poziom {npc.level}</p>
        <NpcStats stats={npc.stats} />
        <button
          type="button"
          className={`${FIGHT_BUTTON} mt-auto`}
          aria-label={`${FIGHT_ACTION_LABEL}: ${npc.nick}`}
          aria-describedby={blockedHint ? hintId : undefined}
          disabled={blockedHint !== null}
          onClick={() => onFight(npc)}
        >
          <span className="flex skew-x-12 flex-col items-center leading-none">
            <span>Walcz</span>
            <span className="mt-0.5 font-cond text-xs font-bold tracking-[.06em] normal-case opacity-90">{FIGHT_COST_LABEL}</span>
          </span>
        </button>
        {blockedHint ? (
          <p id={hintId} className="m-0 text-center font-cond text-sm font-semibold text-white/70">
            {blockedHint}
          </p>
        ) : null}
      </div>
    </article>
  );
}
