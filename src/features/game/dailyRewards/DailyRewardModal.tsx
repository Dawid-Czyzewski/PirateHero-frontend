import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Coins, Gem, Gift, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GAME_PAGE_TITLE_GOLD } from '@/features/game/layout/gamePageTitleClasses';
import type { DailyRewardEntry, DailyRewardStatus, DailyRewardType } from '@/types/dailyReward';

const DAY_CELL_CLASS =
  'relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg border border-border/50 bg-[hsl(220,20%,12%)] px-0.5 py-1 sm:h-[72px] sm:gap-1 sm:px-1 sm:py-1.5';

function RewardIcon({ type, className }: { type: DailyRewardType; className?: string }) {
  const cls = cn('h-4 w-4 shrink-0', className);
  switch (type) {
    case 'gold':
      return <Coins className={cn(cls, 'text-[hsl(43,72%,55%)]')} />;
    case 'diamonds':
      return <Gem className={cn(cls, 'text-cyan-300')} />;
    case 'experience':
      return <Sparkles className={cn(cls, 'text-emerald-400')} />;
    case 'item':
      return <Gift className={cn(cls, 'text-[hsl(43,72%,55%)]')} />;
  }
}

function formatRewardDescription(
  reward: DailyRewardEntry,
  t: (key: string, opts?: { amount?: number }) => string
): string {
  if (reward.type === 'item') {
    return t('dailyReward.randomItem');
  }
  const amount = reward.amount ?? 0;
  switch (reward.type) {
    case 'gold':
      return t('dailyReward.amountGold', { amount });
    case 'diamonds':
      return t('dailyReward.amountDiamonds', { amount });
    case 'experience':
      return t('dailyReward.amountExperience', { amount });
    default:
      return String(amount);
  }
}

function rewardTextColor(type: DailyRewardType): string {
  switch (type) {
    case 'gold':
      return 'text-[hsl(43,72%,55%)]';
    case 'diamonds':
      return 'text-cyan-300';
    case 'experience':
      return 'text-emerald-400';
    case 'item':
      return 'text-[hsl(43,75%,88%)]';
  }
}

function rewardLabel(reward: DailyRewardEntry, t: (key: string, opts?: { amount?: number }) => string): string {
  if (reward.type === 'item') {
    return t('dailyReward.randomItem');
  }
  return String(reward.amount ?? 0);
}

type DailyRewardModalProps = {
  status: DailyRewardStatus;
  claimError: string | null;
  onClose: () => void;
  onClaim: () => void;
  claimDisabled?: boolean;
};

export function DailyRewardModal({
  status,
  claimError,
  onClose,
  onClaim,
  claimDisabled = false,
}: DailyRewardModalProps) {
  const { t } = useTranslation();
  const { schedule, canClaim, claimedToday, currentDay, highestClaimedDay, todayReward } = status;
  const todayEntry = todayReward.rewards[0];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-reward-title"
        className="relative z-10 flex w-full max-w-5xl flex-col rounded-xl border border-primary/30 bg-card/95 shadow-2xl backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border/40 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="daily-reward-title"
              className={cn('font-heading text-xl font-bold uppercase tracking-wide sm:text-2xl', GAME_PAGE_TITLE_GOLD)}
            >
              {t('dailyReward.title')}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{t('dailyReward.subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            aria-label={t('close')}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-4 py-4 sm:px-6">
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-2">
            {schedule.map((day) => {
              const reward = day.rewards[0];
              const isClaimed = day.day <= highestClaimedDay;
              const isToday = day.day === currentDay && canClaim;
              const isMuted = !isClaimed && !isToday;

              return (
                <div
                  key={day.day}
                  className={cn(
                    DAY_CELL_CLASS,
                    isClaimed && 'opacity-45',
                    isToday && 'border-primary/45 bg-primary/5',
                    isMuted && 'opacity-80'
                  )}
                >
                  <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground sm:text-[9px]">
                    {day.day}
                  </span>
                  {reward ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <RewardIcon type={reward.type} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="max-w-full truncate text-[8px] font-semibold text-muted-foreground sm:text-[9px]">
                        {rewardLabel(reward, t)}
                      </span>
                    </div>
                  ) : null}
                  {isClaimed ? (
                    <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border/60 bg-emerald-600 sm:h-4 sm:w-4">
                      <Check className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5" strokeWidth={3} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <footer className="border-t border-border/40 bg-[hsl(220,22%,10%)] px-4 py-4 sm:px-6">
          {claimError ? (
            <p className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {claimError}
            </p>
          ) : null}

          {todayEntry ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border sm:h-16 sm:w-16',
                    claimedToday
                      ? 'border-emerald-600/40 bg-emerald-950/30'
                      : 'border-border/60 bg-[hsl(220,20%,14%)]'
                  )}
                >
                  {claimedToday ? (
                    <Check className="h-7 w-7 text-emerald-400" strokeWidth={2.5} />
                  ) : (
                    <RewardIcon type={todayEntry.type} className="h-7 w-7 sm:h-8 sm:w-8" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {claimedToday
                      ? t('dailyReward.claimedTodayLabel')
                      : t('dailyReward.rewardForDay', { day: todayReward.day })}
                  </p>
                  {claimedToday ? (
                    <p className="mt-1 font-heading text-base font-bold text-foreground sm:text-lg">
                      {t('dailyReward.comeBackTomorrow')}
                    </p>
                  ) : (
                    <p
                      className={cn(
                        'mt-0.5 font-heading text-lg font-bold leading-tight sm:text-xl',
                        rewardTextColor(todayEntry.type)
                      )}
                    >
                      {formatRewardDescription(todayEntry, t)}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClaim}
                disabled={claimedToday || !canClaim || claimDisabled}
                className={cn(
                  'w-full shrink-0 rounded-lg px-6 py-3 font-heading text-sm font-black uppercase tracking-wide sm:w-auto sm:min-w-[10rem]',
                  claimedToday
                    ? 'cursor-default border border-emerald-600/35 bg-emerald-950/40 text-emerald-300/80'
                    : 'cursor-pointer border border-[hsl(43,38%,28%)] bg-[hsl(45,88%,48%)] text-black shadow-sm transition hover:brightness-105 active:brightness-95'
                )}
              >
                {claimedToday ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Check className="h-4 w-4" />
                    {t('dailyReward.claimedButton')}
                  </span>
                ) : (
                  t('dailyReward.claimButton')
                )}
              </button>
            </div>
          ) : null}
        </footer>
      </div>
    </div>,
    document.body
  );
}
