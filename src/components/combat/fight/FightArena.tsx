"use client";

import { useEffect, useRef } from "react";
import { FighterCorner, type Blow } from "@/components/combat/fight/FighterCorner";
import { FightLog } from "@/components/combat/fight/FightLog";
import { FightResultPanel } from "@/components/combat/fight/FightResultPanel";
import { RoundBanner } from "@/components/combat/fight/RoundBanner";
import type { Appearance } from "@/modules/character/appearance";
import { OCTAGON_BACKGROUND_SRC } from "@/modules/combat/combatAssets";
import type { Fight, FighterSide, FightRound } from "@/modules/combat/fight";
import { useFightPlayback } from "@/modules/combat/hooks/useFightPlayback";

type FightArenaProps = {
  fight: Fight;
  playerLook: Appearance;
  onSettled: () => void;
  onRematch: () => void;
  onBack: () => void;
};

function blowOn(side: FighterSide, round: FightRound | null): Blow | null {
  return round && round.attacker !== side ? { id: round.number, damage: round.damage } : null;
}

function useSettleOnce(finished: boolean, onSettled: () => void) {
  const settled = useRef(false);
  const leaving = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!finished || settled.current) return;
    settled.current = true;
    onSettled();
  }, [finished, onSettled]);

  useEffect(() => {
    if (leaving.current) clearTimeout(leaving.current);
    leaving.current = null;
    return () => {
      if (!settled.current) leaving.current = setTimeout(onSettled, 0);
    };
  }, [onSettled]);
}

export function FightArena({ fight, playerLook, onSettled, onRematch, onBack }: FightArenaProps) {
  const { round, revealed, playerHp, npcHp, finished, skip } = useFightPlayback(fight);
  useSettleOnce(finished, onSettled);

  return (
    <div className="flex flex-col gap-3">
      <section
        className="relative overflow-hidden rounded-sm border border-white/10 bg-[#0b0b0f] bg-cover bg-center px-3 pt-3 pb-4 sm:px-6"
        style={{ backgroundImage: `linear-gradient(rgb(11 11 15 / 0.15), rgb(11 11 15 / 0.55)), url(${OCTAGON_BACKGROUND_SRC})` }}
        aria-label={`Walka: ${fight.player.name} kontra ${fight.npc.fighter.name}`}
      >
        <RoundBanner round={round?.number ?? null} knockout={finished && fight.knockout} />
        <div className="mt-3 flex items-end justify-center gap-3 sm:gap-10">
          <FighterCorner name={fight.player.name} hp={playerHp} maxHp={fight.player.maxHp} look={playerLook} blow={blowOn("player", round)} />
          <FighterCorner
            name={fight.npc.fighter.name}
            hp={npcHp}
            maxHp={fight.npc.fighter.maxHp}
            look={fight.npc.look}
            blow={blowOn("npc", round)}
            mirrored
          />
        </div>
        {finished ? null : (
          <button
            type="button"
            className="absolute top-2 right-2 min-h-11 border border-white/30 bg-black/70 px-4 font-cond text-base font-bold tracking-[.08em] text-white uppercase hover:bg-black/90"
            onClick={skip}
          >
            Pomiń
          </button>
        )}
      </section>
      <FightLog fight={fight} rounds={revealed} />
      <div aria-live="polite">{finished ? <FightResultPanel fight={fight} onRematch={onRematch} onBack={onBack} /> : null}</div>
    </div>
  );
}
