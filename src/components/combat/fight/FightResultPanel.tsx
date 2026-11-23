import { GameIcon } from "@/components/game/GameIcon";
import { CURRENCY_ICON_SRC } from "@/modules/character/layerAssets";
import { leveledUp, playerWon, type Fight } from "@/modules/combat/fight";

type FightResultPanelProps = {
  fight: Fight;
  onRematch: () => void;
  onBack: () => void;
};

const PRIMARY =
  "min-h-11 flex-1 -skew-x-12 bg-blood px-4 py-2 font-display text-xl tracking-wider text-white transition hover:brightness-110 active:translate-y-px";
const SECONDARY =
  "min-h-11 flex-1 border border-gold/50 bg-black/60 px-4 font-cond text-lg font-bold tracking-[.08em] text-gold uppercase hover:bg-black/80";

export function FightResultPanel({ fight, onRematch, onBack }: FightResultPanelProps) {
  const won = playerWon(fight);

  return (
    <section className="fl-card flex flex-col gap-3 px-4 py-4 text-center" aria-labelledby="fight-result">
      <h2 id="fight-result" className={`m-0 font-marker text-5xl leading-none ${won ? "text-gold-light" : "text-blood"} [text-shadow:0_3px_0_#000]`}>
        {won ? "Wygrana" : "Przegrana"}
      </h2>
      <dl className="m-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-cond text-xl font-bold text-white">
        <div className="flex items-center gap-2">
          <dt className="text-gold">XP</dt>
          <dd className="m-0 tabular-nums">+{fight.reward.experience}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="flex items-center gap-1">
            <GameIcon src={CURRENCY_ICON_SRC.onions} size={32} />
            <span className="sr-only">Cebuliony</span>
          </dt>
          <dd className="m-0 tabular-nums">+{fight.reward.onions}</dd>
        </div>
      </dl>
      {leveledUp(fight) ? (
        <p className="m-0 font-cond text-2xl font-bold tracking-[.08em] text-gold-light uppercase">Awans! Poziom {fight.level.after}</p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className={PRIMARY} onClick={onRematch}>
          <span className="inline-block skew-x-12">Walcz ponownie</span>
        </button>
        <button type="button" className={SECONDARY} onClick={onBack}>
          Wróć do listy
        </button>
      </div>
    </section>
  );
}
