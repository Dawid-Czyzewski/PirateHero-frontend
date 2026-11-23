import { NpcCard } from "@/components/combat/NpcCard";
import { NpcRosterSkeleton } from "@/components/combat/NpcRosterSkeleton";
import { ROSTER_GRID } from "@/components/combat/rosterLayout";
import { ScreenAlert } from "@/components/game/ScreenAlert";
import type { NpcsState } from "@/modules/combat/hooks/useNpcs";
import { isHardFor, type Npc } from "@/modules/combat/npc";

type NpcRosterProps = {
  state: NpcsState;
  playerLevel: number;
  blockedHint: string | null;
  onRetry: () => void;
  onFight: (npc: Npc) => void;
};

export function NpcRoster({ state, playerLevel, blockedHint, onRetry, onFight }: NpcRosterProps) {
  if (state.kind === "loading") return <NpcRosterSkeleton />;

  if (state.kind === "unavailable") {
    return (
      <ScreenAlert>
        <p className="m-0">Nie udało się wczytać przeciwników.</p>
        <button type="button" className="mt-2 min-h-11 bg-blood px-4 font-display text-lg tracking-wider text-white hover:brightness-110" onClick={onRetry}>
          Spróbuj ponownie
        </button>
      </ScreenAlert>
    );
  }

  if (state.npcs.length === 0) {
    return <p className="fl-card m-0 px-4 py-6 text-center font-cond text-lg font-semibold text-white/80">Oktagon jest dziś pusty. Zajrzyj później.</p>;
  }

  return (
    <section aria-labelledby="octagon-roster">
      <h2 id="octagon-roster" className="sr-only">
        Przeciwnicy
      </h2>
      <ul className={ROSTER_GRID}>
        {state.npcs.map((npc) => (
          <li key={npc.id} className="min-w-0">
            <NpcCard npc={npc} hard={isHardFor(npc, playerLevel)} blockedHint={blockedHint} onFight={onFight} />
          </li>
        ))}
      </ul>
    </section>
  );
}
