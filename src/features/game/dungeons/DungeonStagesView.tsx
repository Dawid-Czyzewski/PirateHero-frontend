import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { STAGES_PER_DUNGEON } from './dungeonData';
import { formatDungeonCooldown } from './formatDungeonCooldown';
import type { DungeonDefinition } from './dungeonTypes';

type Props = {
  dungeon: DungeonDefinition;
  cleared: number;
  onBack: () => void;
  onStart: (stage: number) => void;
  cooldownSecondsRemaining?: number;
};

export function DungeonStagesView({
  dungeon,
  cleared,
  onBack,
  onStart,
  cooldownSecondsRemaining = 0,
}: Props) {
  const { t } = useTranslation();
  const onCooldown = cooldownSecondsRemaining > 0;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 font-heading text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('dungeonsPage.backToList')}
      </button>

      <div className="relative overflow-hidden rounded-xl border border-border">
        <img
          src={dungeon.bg}
          alt=""
          className="h-48 w-full object-cover"
          loading="lazy"
          width={1024}
          height={576}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
          <p className="font-heading text-xs uppercase tracking-[0.2em] text-primary/80">
            {t('dungeonsPage.pickStage')}
          </p>
          <h2 className="mt-1 font-heading text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {t(dungeon.nameKey)}
          </h2>
          <p className="mt-1 max-w-md text-sm text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {t(dungeon.descKey)}
          </p>
        </div>
      </div>

      {onCooldown ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {t('dungeonsPage.cooldownActive', {
            time: formatDungeonCooldown(cooldownSecondsRemaining),
          })}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-5">
        {Array.from({ length: STAGES_PER_DUNGEON }, (_, i) => {
          const stage = i + 1;
          const isCleared = stage <= cleared;
          const isCurrent = stage === cleared + 1;
          const isLocked = !isCurrent || onCooldown;

          return (
            <button
              key={stage}
              type="button"
              disabled={isLocked}
              title={
                onCooldown && isCurrent
                  ? t('dungeonsPage.cooldownActive', {
                      time: formatDungeonCooldown(cooldownSecondsRemaining),
                    })
                  : isCleared
                    ? t('dungeonsPage.completedLocked')
                    : undefined
              }
              onClick={() => onStart(stage)}
              className={`relative min-h-[6.5rem] rounded-xl border px-4 py-6 text-center transition-all sm:min-h-[7.5rem] sm:py-8 ${
                isLocked
                  ? isCleared
                    ? 'cursor-not-allowed border-green-500/40 bg-green-500/5 opacity-70'
                    : 'cursor-not-allowed border-border bg-card/50 opacity-50'
                  : 'cursor-pointer border-primary/60 bg-primary/10 shadow-[0_0_20px_hsl(42,90%,50%,0.2)] hover:bg-primary/20'
              } ${isCurrent && !isLocked ? 'animate-pulse' : ''}`}
            >
              <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t('dungeonsPage.stage')}
              </p>
              <p
                className={`mt-1 font-heading text-4xl font-black sm:text-5xl ${
                  isCleared ? 'text-green-400' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {stage}
              </p>
              {isCleared ? (
                <span className="absolute right-2 top-2 text-sm text-green-400 sm:text-base" aria-hidden>
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
