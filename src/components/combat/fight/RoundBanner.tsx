import { GameIcon } from "@/components/game/GameIcon";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";

type RoundBannerProps = {
  round: number | null;
  knockout: boolean;
};

export function RoundBanner({ round, knockout }: RoundBannerProps) {
  if (knockout) {
    return (
      <p className="m-0 flex items-center justify-center gap-2 font-display text-4xl leading-none text-blood [text-shadow:0_2px_0_#000]" role="status">
        <GameIcon src={FIGHT_ICON_SRC.knockout} size={48} />
        K.O.!
      </p>
    );
  }

  return (
    <p className="m-0 flex items-center justify-center gap-2 font-cond text-xl font-bold tracking-[.12em] text-gold uppercase" role="status">
      <GameIcon src={FIGHT_ICON_SRC.round} size={32} />
      {round === null ? "Gong!" : `Runda ${round}`}
    </p>
  );
}
