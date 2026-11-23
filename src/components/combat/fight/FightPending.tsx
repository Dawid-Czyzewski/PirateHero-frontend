import { GameIcon } from "@/components/game/GameIcon";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";

export function FightPending({ opponent }: { opponent: string | null }) {
  return (
    <div className="fl-card flex flex-col items-center gap-2 px-4 py-8 text-center" role="status" aria-live="polite">
      <span className="animate-pulse motion-reduce:animate-none">
        <GameIcon src={FIGHT_ICON_SRC.round} size={48} />
      </span>
      <p className="m-0 font-cond text-xl font-bold tracking-[.08em] text-white uppercase">
        {opponent ? `Wchodzisz do klatki: ${opponent}` : "Wchodzisz do klatki"}
      </p>
    </div>
  );
}
