import { Coins, Gem, Star } from 'lucide-react';
import { useEffect, useId, useMemo } from 'react';
import type { TFunction } from 'react-i18next';
import { ShopItemTooltipCard } from '@/features/game/store/shop/ShopItemTooltip';
import { dungeonRewardItemToShopItem } from '@/features/game/dungeons/dungeonRewardItemToShopItem';
import type { ArenaDungeonVictoryRewards } from './arenaTypes';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
  fameEarned: number;
  dungeonRewards?: ArenaDungeonVictoryRewards;
  hideRewards?: boolean;
  primaryActionLabel?: string;
};

export function ArenaBattleVictoryModal({
  isOpen,
  onClose,
  t,
  fameEarned,
  dungeonRewards,
  hideRewards = false,
  primaryActionLabel,
}: Props) {
  const closeLabel = primaryActionLabel ?? String(t('arenaPage.backToArena'));
  const titleId = useId();
  const descId = useId();
  const completionItem = dungeonRewards?.completionReward?.item ?? null;
  const completionShopItem = useMemo(
    () => (completionItem ? dungeonRewardItemToShopItem(completionItem) : null),
    [completionItem]
  );
  const hasWideLayout = Boolean(completionShopItem);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`w-full rounded-xl border border-[hsl(43,38%,28%)]/55 bg-[hsl(220_20%_14%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.55)] outline-none ${
          hasWideLayout ? 'max-w-lg' : 'max-w-md'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.07] bg-[hsl(220_18%_11%)] px-5 py-4 text-center">
          <p className="text-4xl" aria-hidden>
            🏆
          </p>
          <h2
            id={titleId}
            className="mt-2 font-heading text-lg font-black uppercase tracking-[0.15em] text-[hsl(43,72%,55%)] sm:text-xl"
          >
            {dungeonRewards?.dungeonCompleted
              ? t('dungeonsPage.dungeonCompletedTitle')
              : t('arenaPage.victoryTitle')}
          </h2>
        </div>
        <div className="px-5 py-5">
          <p id={descId} className="text-center text-base font-display font-semibold text-white/90">
            {dungeonRewards?.dungeonCompleted
              ? t('dungeonsPage.dungeonCompletedMessage')
              : dungeonRewards
                ? t('dungeonsPage.victory')
                : t('arenaPage.wonMessage')}
          </p>
          {!hideRewards ? (
            <div className="mt-5 flex flex-col items-center gap-3">
              {dungeonRewards ? (
                <>
                  {(dungeonRewards.gold > 0 || dungeonRewards.xp > 0) && (
                    <div className="flex flex-wrap justify-center gap-3">
                      {dungeonRewards.gold > 0 ? (
                        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/45 bg-primary/15 px-5 py-2.5 font-display text-sm font-semibold tabular-nums text-primary">
                          <Coins className="h-5 w-5 shrink-0" aria-hidden />
                          <span>+{dungeonRewards.gold}</span>
                        </span>
                      ) : null}
                      {dungeonRewards.xp > 0 ? (
                        <span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/45 bg-purple-500/15 px-5 py-2.5 font-display text-sm font-semibold tabular-nums text-purple-200">
                          <Star className="h-5 w-5 shrink-0 fill-purple-400/90 text-purple-400" aria-hidden />
                          <span>+{dungeonRewards.xp} XP</span>
                        </span>
                      ) : null}
                    </div>
                  )}
                  {dungeonRewards.completionReward ? (
                    <div className="w-full rounded-lg border border-amber-500/35 bg-amber-500/10 p-4 text-center">
                      <p className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-amber-200">
                        {t('dungeonsPage.completionRewardTitle')}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {dungeonRewards.completionReward.gold > 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/45 bg-primary/15 px-3 py-1.5 text-sm font-semibold text-primary">
                            <Coins className="h-4 w-4" aria-hidden />
                            +{dungeonRewards.completionReward.gold}
                          </span>
                        ) : null}
                        {dungeonRewards.completionReward.diamonds > 0 ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/45 bg-blue-500/15 px-3 py-1.5 text-sm font-semibold text-blue-200">
                            <Gem className="h-4 w-4" aria-hidden />
                            +{dungeonRewards.completionReward.diamonds}
                          </span>
                        ) : null}
                      </div>
                      {completionShopItem ? (
                        <div className="mt-4 flex justify-center">
                          <ShopItemTooltipCard
                            item={completionShopItem}
                            comparedItem={null}
                            priceMode="sell"
                            showPrice={false}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : (
              <>
                  <span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/45 bg-purple-500/15 px-5 py-2.5 font-display text-sm font-semibold tabular-nums text-purple-200">
                    <Star className="h-5 w-5 shrink-0 fill-purple-400/90 text-purple-400" aria-hidden />
                    <span>+{fameEarned}</span>
                    <span className="font-normal text-purple-300/85">{t('characterPage.fameLabel')}</span>
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="mt-4" />
          )}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-[hsl(43,38%,28%)] bg-[hsl(45,88%,48%)] px-8 py-2.5 font-heading text-xs font-bold uppercase tracking-wide text-black shadow-md transition hover:brightness-105"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
