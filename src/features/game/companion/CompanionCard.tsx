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
    locked ||
    !companion.canFeed ||
    atMaxLevel ||
    !canAffordFeed ||
    busy !== null;
  const equipDisabled = locked || busy !== null;
  const abilityDisabled = locked || !isEquipped || !abilityReady || busy !== null;

  const name = t(companion.nameKey, { defaultValue: t('companion.parrot.name') });
  const description = t(companion.descriptionKey, {
    defaultValue: t('companion.parrot.description'),
  });

  return (
    <article
      className={`rounded-xl border px-4 py-4 ${
        locked
          ? 'border-border/50 bg-muted/10 opacity-90'
          : 'border-border/60 bg-card/30'
      }`}
      aria-label={name}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-3xl"
          aria-hidden
        >
          {locked ? <Lock className="h-7 w-7 text-muted-foreground" /> : '🦜'}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">{name}</h2>
            {isEquipped ? (
              <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                {t('companionPage.equipped')}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
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
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">{t('companionPage.levelLabel')}: </span>
              <span className="font-semibold text-foreground">
                {companion.level} / {COMPANION_MAX_LEVEL}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">{t('companionPage.workBonusLabel')}: </span>
              <span className="font-semibold text-emerald-400">
                +{companion.workGoldBonusPercent}%
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={feedDisabled}
              onClick={onFeed}
              className="w-full rounded-lg border border-primary/40 bg-primary/15 px-3 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('companionPage.unequip')}
              </button>
            ) : (
              <button
                type="button"
                disabled={equipDisabled}
                onClick={onEquip}
                className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('companionPage.equip')}
              </button>
            )}

            <button
              type="button"
              disabled={abilityDisabled}
              onClick={onAbility}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Bird className="h-4 w-4 shrink-0" aria-hidden />
              {t('companionPage.useAbility')}
            </button>
            <p className="text-xs text-muted-foreground">{t('companionPage.abilityHint')}</p>
          </div>
        </div>
      )}
    </article>
  );
}
