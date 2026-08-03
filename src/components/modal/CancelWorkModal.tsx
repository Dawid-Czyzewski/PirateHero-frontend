import { useEffect, useId } from 'react';

export type CancelWorkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  dismissLabel: string;
};

export default function CancelWorkModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  dismissLabel,
}: CancelWorkModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
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
          <p id={descId} className="text-center text-sm leading-relaxed text-white/80 sm:text-base">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-wide text-white/90 transition hover:border-white/25 hover:bg-white/[0.1]"
            >
              {dismissLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="cursor-pointer rounded-lg border border-red-800/80 bg-red-600 px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-wide text-white shadow-md transition hover:border-red-500/60 hover:bg-red-500"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
