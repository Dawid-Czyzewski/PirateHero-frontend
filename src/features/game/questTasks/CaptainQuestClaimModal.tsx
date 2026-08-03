import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Coins, Crown, Gem, Gift, Loader2, Sparkles } from 'lucide-react';
import { ShopItemTooltipCard } from '@/features/game/store/shop/ShopItemTooltip';
import type { CaptainQuestReward } from './captainQuestTypes';
import { captainQuestItemRewardToShopItem } from './questClaimItemToShopItem';

function RewardItemShopCard({ reward }: { reward: Extract<CaptainQuestReward, { type: 'item' }> }) {
  const shopItem = useMemo(() => captainQuestItemRewardToShopItem(reward), [reward]);
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center">
      <ShopItemTooltipCard
        item={shopItem}
        comparedItem={null}
        priceMode="sell"
        showPrice={false}
      />
    </div>
  );
}

function RewardSummary({ reward, t }: { reward: CaptainQuestReward; t: TFunction }) {
  if (reward.type === 'gold') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Coins className="h-14 w-14 text-[hsl(43,72%,55%)] sm:h-16 sm:w-16" aria-hidden />
        <p className="font-heading text-3xl font-black tabular-nums text-[hsl(43,72%,55%)] sm:text-4xl">
          {reward.amount}
        </p>
        <p className="text-sm font-semibold text-muted-foreground">{String(t('questTasksPage.claimModalGold'))}</p>
      </div>
    );
  }
  if (reward.type === 'premium') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Gem className="h-14 w-14 text-cyan-300 sm:h-16 sm:w-16" aria-hidden />
        <p className="font-heading text-3xl font-black tabular-nums text-cyan-200 sm:text-4xl">{reward.amount}</p>
        <p className="text-sm font-semibold text-muted-foreground">{String(t('questTasksPage.claimModalPremium'))}</p>
      </div>
    );
  }
  if (reward.type === 'experience') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Sparkles className="h-14 w-14 text-amber-200 sm:h-16 sm:w-16" aria-hidden />
        <p className="font-heading text-3xl font-black tabular-nums text-amber-100 sm:text-4xl">{reward.amount}</p>
        <p className="text-sm font-semibold text-muted-foreground">{String(t('questTasksPage.claimModalExperience'))}</p>
      </div>
    );
  }
  return <RewardItemShopCard reward={reward} />;
}

type CaptainQuestClaimModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questTitle: string | null;
  reward: CaptainQuestReward | null;
  rewardLoading?: boolean;
  rewardTitleLine?: string | null;
};

export function CaptainQuestClaimModal({
  isOpen,
  onClose,
  questTitle,
  reward,
  rewardLoading = false,
  rewardTitleLine = null,
}: CaptainQuestClaimModalProps) {
  const { t } = useTranslation();

  const blockDismiss = rewardLoading && reward.type === 'item';
  const blockDismissRef = useRef(blockDismiss);
  blockDismissRef.current = blockDismiss;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !blockDismissRef.current) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !reward || !questTitle) return null;

  const showItemSpinner = reward.type === 'item' && rewardLoading;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${blockDismiss ? '' : 'cursor-pointer'}`}
        onClick={blockDismiss ? undefined : onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="captain-quest-claim-title"
        aria-busy={showItemSpinner}
        className="relative z-10 flex w-full max-w-md flex-col rounded-xl border border-primary/30 bg-card/95 p-6 shadow-2xl backdrop-blur-md sm:max-w-lg sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Gift className="mx-auto mb-3 h-11 w-11 text-[hsl(43,72%,55%)] sm:h-14 sm:w-14" aria-hidden />
        <h2
          id="captain-quest-claim-title"
          className="mb-2 text-center font-heading text-2xl font-bold tracking-wide text-[hsl(43,72%,55%)] sm:text-3xl"
        >
          {t('questTasksPage.claimModalTitle')}
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">{t('questTasksPage.claimModalSubtitle')}</p>

        <div className="mb-2 rounded-lg border border-border/60 bg-muted/25 px-3 py-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('questTasksPage.claimModalQuest')}
          </span>
          <p className="font-heading text-base font-semibold text-foreground">{questTitle}</p>
        </div>

        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-6 sm:p-8">
          {showItemSpinner ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
              <Loader2 className="h-14 w-14 animate-spin text-primary sm:h-16 sm:w-16" aria-hidden />
              <p className="text-sm font-semibold text-muted-foreground">{t('questTasksPage.claimModalItemLoading')}</p>
            </div>
          ) : (
            <>
              <RewardSummary reward={reward} t={t} />
              {rewardTitleLine ? (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-200/90">
                  <Crown className="h-4 w-4 shrink-0" aria-hidden />
                  {rewardTitleLine}
                </p>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={showItemSpinner}
          className={`w-full rounded-lg px-5 py-3 font-heading text-sm font-black uppercase tracking-wide shadow-md transition ${
            showItemSpinner
              ? 'cursor-not-allowed border border-border bg-muted/50 text-muted-foreground opacity-70'
              : 'cursor-pointer bg-gradient-to-r from-primary to-amber-600 text-primary-foreground hover:from-primary/90 hover:to-amber-500'
          }`}
        >
          {t('questTasksPage.claimModalButton')}
        </button>
      </div>
    </div>,
    document.body
  );
}
