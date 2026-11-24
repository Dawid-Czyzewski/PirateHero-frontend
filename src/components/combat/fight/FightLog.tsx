import { GameIcon } from "@/components/game/GameIcon";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";
import type { Fight, FightRound } from "@/modules/combat/fight";
import { describeRound, isKnockoutBlow } from "@/modules/combat/fightLog";

type FightLogProps = {
  fight: Fight;
  rounds: readonly FightRound[];
};

const SIDE_COLOR = { player: "text-gold-light", npc: "text-[#ff8a95]" } as const;

export function FightLog({ fight, rounds }: FightLogProps) {
  if (rounds.length === 0) return null;
  const newestFirst = [...rounds].reverse();

  return (
    <section className="fl-card px-3 py-3 desk:px-4" aria-labelledby="fight-log">
      <h3 id="fight-log" className="m-0 mb-2 font-cond text-sm font-bold tracking-[.14em] text-gold uppercase">
        Historia walki
      </h3>
      <ol reversed className="m-0 flex max-h-56 list-none flex-col gap-1 overflow-y-auto p-0 pr-1">
        {newestFirst.map((round) => {
          const knockout = isKnockoutBlow(round, fight);
          return (
            <li
              key={round.number}
              className={`flex min-w-0 items-start gap-2 rounded-sm px-1.5 py-1 font-cond text-sm leading-snug font-semibold sm:text-base ${SIDE_COLOR[round.attacker]} ${knockout ? "bg-blood/25 font-bold ring-1 ring-blood" : ""}`}
            >
              <GameIcon src={knockout ? FIGHT_ICON_SRC.knockout : FIGHT_ICON_SRC.hit} size={24} />
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {describeRound(round, fight)}
                {knockout ? <strong className="ml-1 text-white">K.O.!</strong> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
