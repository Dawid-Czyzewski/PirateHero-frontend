import { useEffect, useId } from 'react';
import type { TFunction } from 'react-i18next';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
  won: boolean;
  primaryActionLabel?: string;
};

export function ArenaBattleReplayEndModal({
  isOpen,
  onClose,
  t,
  won,
  primaryActionLabel,
}: Props) {
  const closeLabel = primaryActionLabel ?? String(t('arenaPage.replayEndButton'));
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
        className="w-full max-w-md rounded-xl border border-[hsl(43,38%,28%)]/55 bg-[hsl(220_20%_14%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.55)] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.07] bg-[hsl(220_18%_11%)] px-5 py-4 text-center">
          <p className="text-4xl" aria-hidden>
            🎬
          </p>
          <h2
            id={titleId}
            className="mt-2 font-heading text-lg font-black uppercase tracking-[0.15em] text-[hsl(43,72%,55%)] sm:text-xl"
          >
            {t('arenaPage.replayFinishedTitle')}
          </h2>
        </div>
        <div className="px-5 py-5">
          <p
            id={descId}
            className={`text-center text-base font-display font-semibold ${
              won ? 'text-white/90' : 'text-red-200/90'
            }`}
          >
            {won ? t('arenaPage.wonMessage') : t('arenaPage.lostMessage')}
          </p>
          <p className="mt-3 text-center text-sm text-white/55">{t('arenaPage.replayFinishedHint')}</p>
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
