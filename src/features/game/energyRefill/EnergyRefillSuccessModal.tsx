import { useEffect, useId } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  closeLabel: string;
};

export function EnergyRefillSuccessModal({ isOpen, onClose, title, message, closeLabel }: Props) {
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
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-md rounded-xl border border-[hsl(43,38%,28%)]/55 bg-[hsl(220_20%_14%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.55)] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/[0.07] bg-[hsl(220_18%_11%)] px-5 py-4">
          <h2
            id={titleId}
            className="font-heading text-base font-black uppercase tracking-[0.15em] text-[hsl(43,72%,55%)] sm:text-lg"
          >
            {title}
          </h2>
        </div>
        <div className="px-5 py-5">
          <p id={descId} className="text-center text-sm leading-relaxed text-white/85 sm:text-base">
            {message}
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-[hsl(43,38%,28%)] bg-[hsl(45,88%,48%)] px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wide text-black shadow-md transition hover:brightness-105"
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
