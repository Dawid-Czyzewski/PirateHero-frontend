import { useEffect, useId } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type LevelUpInfo = {
  name: string;
  expToNextLevel?: number;
};

export type LevelUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDistributePoints: () => void;
  newLevel?: LevelUpInfo | null;
  
  rewardPoints?: number;
};

export default function LevelUpModal({
  isOpen,
  onClose,
  onDistributePoints,
  newLevel,
  rewardPoints = 5,
}: LevelUpModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descId = useId();

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

  if (!isOpen || !newLevel) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-md rounded-xl border border-[hsl(43,38%,32%)]/90 bg-gradient-to-b from-[hsl(220_22%_13%)] to-[hsl(220_28%_7%)] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_60px_rgba(0,0,0,0.55)] outline-none sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col items-center text-center">
          <div className="mb-4 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full border-2 border-[hsl(43,72%,52%)] bg-[hsl(43,35%,14%)] shadow-[0_0_24px_hsla(43,90%,40%,0.25)]">
            <Star
              className="h-11 w-11 fill-[hsl(43,78%,52%)] text-[hsl(43,78%,52%)]"
              strokeWidth={1.2}
              aria-hidden
            />
          </div>

          <h2
            id={titleId}
            className="font-heading text-lg font-black uppercase tracking-[0.2em] text-[hsl(43,72%,55%)] sm:text-xl"
          >
            {t('levelUpModal.title')}
          </h2>

          <p className="mt-3 font-serif text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl">
            {newLevel.name}
          </p>

          <p id={descId} className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {t('levelUpModal.congrats')}
          </p>
        </div>

        <div className="mt-6 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-5 text-center">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(43,72%,52%)] sm:text-xs">
            {t('levelUpModal.rewardLabel')}
          </p>
          <p className="mt-2 font-serif text-2xl font-bold tabular-nums text-white sm:text-3xl">
            +{rewardPoints}
          </p>
          <p className="mt-1 text-sm text-white/65">{t('levelUpModal.rewardDescription')}</p>
        </div>

        <button
          type="button"
          onClick={onDistributePoints}
          className="mt-6 w-full cursor-pointer rounded-lg bg-[hsl(45,88%,48%)] px-4 py-3.5 font-heading text-sm font-black uppercase tracking-[0.12em] text-black shadow-md transition hover:brightness-105 active:brightness-95"
        >
          {t('levelUpModal.distributePoints')}
        </button>
      </div>
    </div>
  );
}
