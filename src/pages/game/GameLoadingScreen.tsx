import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Anchor, Ship, Skull, Swords, type LucideIcon } from 'lucide-react';
import { gamePageTitleH1ClassCenter } from '@/features/game/layout/gamePageTitleClasses';

const ROTATION_ICONS: LucideIcon[] = [Anchor, Skull, Swords, Ship];

const PROGRESS_INTERVAL_MS = 120;
const PROGRESS_MIN_STEP = 2;
const PROGRESS_MAX_STEP = 10;
const COMPLETE_CALLBACK_DELAY_MS = 400;

export type GameLoadingScreenProps = {
  progress?: number;
  onComplete?: () => void;
};

function readTips(t: (key: string, options?: { returnObjects?: boolean }) => unknown): string[] {
  const raw = t('gameLoadingScreen.tips', { returnObjects: true });
  return Array.isArray(raw) ? (raw as string[]).filter((s) => typeof s === 'string' && s.length > 0) : [];
}

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.floor(value)));
}

export default function GameLoadingScreen({ progress: controlledProgress, onComplete }: GameLoadingScreenProps) {
  const { t } = useTranslation();
  const tips = useMemo(() => readTips(t), [t]);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const isControlled = controlledProgress !== undefined;
  const progress = isControlled ? clampProgress(controlledProgress) : simulatedProgress;
  const isComplete = progress >= 100;

  useEffect(() => {
    if (tips.length === 0) return;
    setTipIndex(Math.floor(Math.random() * tips.length));
  }, [tips.length]);

  useEffect(() => {
    if (isControlled || isComplete) return;
    const id = window.setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) return 100;
        const step = PROGRESS_MIN_STEP + Math.random() * (PROGRESS_MAX_STEP - PROGRESS_MIN_STEP);
        return Math.min(prev + step, 100);
      });
    }, PROGRESS_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isControlled, isComplete]);

  useEffect(() => {
    if (!isComplete || typeof onComplete !== 'function') return;
    const id = window.setTimeout(onComplete, COMPLETE_CALLBACK_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [isComplete, onComplete]);

  const IconComp = ROTATION_ICONS[Math.floor(progress / 25) % ROTATION_ICONS.length];
  const pct = progress;
  const tip = tips[tipIndex] ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[hsl(220,25%,6%)]"
      aria-busy={!isComplete}
      aria-live="polite"
      aria-label={t('gameLoadingScreen.ariaLabel')}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(220,25%,3%)_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div className="relative">
          <div
            className="absolute inset-0 animate-ping rounded-full bg-primary/20"
            style={{ animationDuration: '2s' }}
            aria-hidden
          />
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
            <IconComp className="h-10 w-10 animate-pulse text-primary" aria-hidden />
          </div>
        </div>

        <div>
          <h1 className={gamePageTitleH1ClassCenter}>
            {t('gameLoadingScreen.title')}
          </h1>
          {t('gameLoadingScreen.subtitle') ? (
            <p className="mt-1 font-heading text-xs uppercase tracking-[0.3em] text-primary">
              {t('gameLoadingScreen.subtitle')}
            </p>
          ) : null}
        </div>

        <div className="w-72">
          <div
            className="relative h-3 w-full overflow-hidden rounded-full border border-border/30 bg-secondary/50"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-valuetext={t('gameLoadingScreen.progressPercent', { percent: pct })}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-[hsl(42,100%,60%)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 w-full rounded-full opacity-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.4), transparent)',
                transform: `translateX(${progress - 100}%)`,
                transition: 'transform 300ms',
              }}
              aria-hidden
            />
          </div>
          <p className="mt-2 font-heading text-xs tracking-widest text-muted-foreground">
            {t('gameLoadingScreen.progressPercent', { percent: pct })}
          </p>
        </div>

        {tip ? (
          <div className="flex max-w-xs items-start gap-2 rounded-lg border border-border/20 bg-secondary/30 px-4 py-3">
            <Anchor className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" aria-hidden />
            <p className="text-left text-xs leading-relaxed text-muted-foreground">{tip}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
