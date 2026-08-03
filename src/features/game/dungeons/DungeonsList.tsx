import { CheckCircle2, Skull, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DUNGEONS, STAGES_PER_DUNGEON } from './dungeonData';
import type { DungeonDefinition, DungeonProgress } from './dungeonTypes';

type Props = {
  progress: DungeonProgress;
  playerLevel: number;
  onOpen: (dungeon: DungeonDefinition) => void;
};

function CompletedDungeonOverlay({ label }: { label: string }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950/25 via-black/10 to-black/55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/20 backdrop-blur-[1.5px]"
        aria-hidden
      />
      <span className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-emerald-400/35 bg-black/55 px-4 py-2 font-heading text-[11px] font-black uppercase tracking-[0.14em] text-emerald-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:text-xs">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
        {label}
      </span>
    </>
  );
}

export function DungeonsList({ progress, playerLevel, onOpen }: Props) {
  const { t } = useTranslation();
  const completedLabel = t('dungeonsPage.dungeonCompleted');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {DUNGEONS.map((d, idx) => {
        const cleared = progress[d.id] ?? 0;
        const locked = playerLevel < d.reqLevel;
        const completed = cleared >= STAGES_PER_DUNGEON;
        const disabled = locked || completed;

        return (
          <button
            key={d.id}
            type="button"
            disabled={disabled}
            onClick={() => onOpen(d)}
            className={`group relative overflow-hidden rounded-xl border bg-card text-left transition-all ${
              completed
                ? 'cursor-not-allowed border-emerald-500/30 shadow-[0_0_0_1px_hsl(152_45%_42%_/0.12),0_8px_28px_-8px_rgba(16,185,129,0.22)]'
                : locked
                  ? 'cursor-not-allowed border-border opacity-60'
                  : 'cursor-pointer border-border hover:border-primary/60 hover:shadow-[0_0_30px_hsl(42,90%,50%,0.15)]'
            }`}
          >
            <div className="relative h-36 overflow-hidden sm:h-44 lg:h-52 xl:h-56">
              <img
                src={d.bg}
                alt=""
                loading="lazy"
                width={1024}
                height={576}
                className={`h-full w-full object-cover transition-transform duration-500 ${
                  completed
                    ? 'scale-[1.02] brightness-[0.88] saturate-[0.8]'
                    : locked
                      ? 'grayscale'
                      : 'group-hover:scale-105'
                }`}
              />
              {completed ? <CompletedDungeonOverlay label={completedLabel} /> : null}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 font-heading text-[11px] font-black uppercase tracking-wider shadow-lg sm:text-xs ${
                  completed
                    ? 'border border-emerald-400/30 bg-emerald-950/75 text-emerald-100'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {t('dungeonsPage.dungeonBadge', { number: idx + 1 })}
              </span>
              {locked ? (
                <span className="absolute right-3 top-3 rounded-full border border-border bg-black/70 px-2.5 py-0.5 text-[11px] font-bold uppercase text-muted-foreground sm:text-xs">
                  {t('dungeonsPage.locked')}
                </span>
              ) : null}
              <div
                className={`absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 ${
                  completed ? 'opacity-80' : ''
                }`}
              >
                <h3 className="font-heading text-base font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg lg:text-xl">
                  {t(d.nameKey)}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-xs md:line-clamp-2 lg:line-clamp-3">
                  {t(d.descKey)}
                </p>
              </div>
            </div>
            <div
              className={`border-t px-4 py-3.5 sm:px-5 sm:py-4 ${
                completed
                  ? 'border-emerald-500/20 bg-gradient-to-r from-emerald-950/25 via-card to-emerald-950/25'
                  : 'border-border/50 bg-card'
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Skull className="h-3.5 w-3.5 text-primary/80 sm:h-4 sm:w-4" aria-hidden />
                  {t('dungeonsPage.reqLevel')}{' '}
                  <span className="ml-1 font-bold text-primary">{d.reqLevel}</span>
                </span>
                {completed ? (
                  <span className="flex items-center gap-1.5 font-heading text-base font-bold text-emerald-300 sm:text-lg">
                    <Trophy className="h-4 w-4 text-emerald-400/90 sm:h-[18px] sm:w-[18px]" aria-hidden />
                    {cleared}/{STAGES_PER_DUNGEON}
                  </span>
                ) : (
                  <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                    {cleared}/{STAGES_PER_DUNGEON}
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
                <div
                  className={`h-full bg-gradient-to-r ${
                    completed ? 'from-emerald-600 via-emerald-400 to-emerald-300' : 'from-primary to-yellow-300'
                  }`}
                  style={{ width: `${(cleared / STAGES_PER_DUNGEON) * 100}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
