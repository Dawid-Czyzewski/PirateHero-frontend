import { Bird, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  COMPANION_FEED_GOLD_COST,
  COMPANION_MAX_LEVEL,
  COMPANION_UNLOCK_LEVEL,
  type CompanionDto,
} from '@/services/companionService';

type Props = {
  companion: CompanionDto;
  equippedCode: string | null;
  abilityReady: boolean;
  gold: number;
  playerLevel: number;
  busy: string | null;
  onFeed: () => void;
  onEquip: () => void;
  onUnequip: () => void;
  onAbility: () => void;
};

export function CompanionCard({
  companion,
  equippedCode,
  abilityReady,
  gold,
  playerLevel,
  busy,
  onFeed,
  onEquip,
  onUnequip,
  onAbility,
}: Props) {
  const { t } = useTranslation();
  const owned = companion.unlocked;
  const locked = !owned;
  const isEquipped = equippedCode === companion.code;
  const atMaxLevel = companion.level >= COMPANION_MAX_LEVEL;
  const canAffordFeed = gold >= COMPANION_FEED_GOLD_COST;
  const feedDisabled =
    locked || !companion.canFeed || atMaxLevel || !canAffordFeed || busy !== null;
  const equipDisabled = locked || busy !== null;
  const abilityDisabled = locked || !isEquipped || !abilityReady || busy !== null;

  const name = t(companion.nameKey, { defaultValue: t('companion.parrot.name') });
  const description = t(companion.descriptionKey, {
    defaultValue: t('companion.parrot.description'),
  });

  return (
    <article
      className={`rounded-xl border px-4 py-4 sm:px-5 ${
        locked ? 'border-border bg-card/60' : 'border-border bg-card'
      }`}
      aria-label={name}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 sm:h-16 sm:w-16"
          aria-hidden
        >
          {locked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Bird className="h-7 w-7 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-sm font-bold text-foreground sm:text-base">{name}</h2>
            {isEquipped ? (
              <span className="rounded bg-primary/15 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wide text-primary">
                {t('companionPage.equipped')}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
        </div>
      </div>

      {locked ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          {playerLevel < COMPANION_UNLOCK_LEVEL
            ? t('companionPage.lockedUntilLevel', { level: COMPANION_UNLOCK_LEVEL })
            : t('companionPage.locked')}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs sm:text-sm">
            <p>
              <span className="text-muted-foreground">{t('companionPage.levelLabel')}: </span>
              <span className="font-semibold text-foreground">
                {companion.level} / {COMPANION_MAX_LEVEL}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">{t('companionPage.workBonusLabel')}: </span>
              <span className="font-semibold text-primary">+{companion.workGoldBonusPercent}%</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={feedDisabled}
              onClick={onFeed}
              className={`cursor-pointer rounded-lg px-3 py-2.5 font-heading text-[11px] uppercase tracking-wide sm:min-w-[8.5rem] ${
                !feedDisabled
                  ? 'bg-primary text-primary-foreground'
                  : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
              }`}
            >
              {atMaxLevel
                ? t('companionPage.maxLevel')
                : t('companionPage.feed', { gold: COMPANION_FEED_GOLD_COST })}
            </button>

            {isEquipped ? (
              <button
                type="button"
                disabled={equipDisabled}
                onClick={onUnequip}
                className="cursor-pointer rounded-lg border border-border bg-muted/40 px-3 py-2.5 font-heading text-[11px] uppercase tracking-wide text-muted-foreground hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[8.5rem]"
              >
                {t('companionPage.unequip')}
              </button>
            ) : (
              <button
                type="button"
                disabled={equipDisabled}
                onClick={onEquip}
                className="cursor-pointer rounded-lg border border-border bg-muted/40 px-3 py-2.5 font-heading text-[11px] uppercase tracking-wide text-foreground hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[8.5rem]"
              >
                {t('companionPage.equip')}
              </button>
            )}

            <button
              type="button"
              disabled={abilityDisabled}
              onClick={onAbility}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-heading text-[11px] uppercase tracking-wide sm:min-w-[10rem] ${
                !abilityDisabled
                  ? 'border border-primary/35 bg-primary/10 text-primary'
                  : 'cursor-not-allowed border border-border bg-muted/40 text-muted-foreground'
              }`}
            >
              <Bird className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t('companionPage.useAbility')}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{t('companionPage.abilityHint')}</p>
        </div>
      )}
    </article>
  );
}
