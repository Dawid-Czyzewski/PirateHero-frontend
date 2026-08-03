import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode | null;
  type?: 'success' | 'error';
  variant?: 'default' | 'game';
};

function getFocusable(root: HTMLElement): HTMLElement[] {
  const sel = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

export default function Modal({
  isOpen,
  onClose,
  title = '',
  description = '',
  children = null,
  footer = null,
  type = 'success',
  variant = 'default',
}: ModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onDocKey);
    return () => document.removeEventListener('keydown', onDocKey);
  }, [isOpen, onClose]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = getFocusable(panelRef.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    const tId = window.setTimeout(() => {
      const root = panelRef.current;
      if (!root) return;
      const focusables = getFocusable(root);
      (focusables[0] ?? root).focus();
    }, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(tId);
      document.body.style.overflow = prevOverflow;
      lastFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isGame = variant === 'game';

  const backgroundClass = isGame
    ? type === 'success'
      ? 'border border-emerald-500/35 bg-card/95 text-foreground shadow-2xl backdrop-blur-md'
      : 'border border-destructive/45 bg-card/95 text-foreground shadow-2xl backdrop-blur-md'
    : type === 'success'
      ? 'bg-gradient-to-b from-gray-800 to-gray-900 border border-green-500 text-white'
      : 'bg-gradient-to-b from-gray-800 to-gray-900 border border-red-500 text-white';

  const titleClass = isGame
    ? type === 'success'
      ? 'font-heading text-xl font-bold tracking-wide text-[hsl(43,72%,55%)] sm:text-2xl'
      : 'font-heading text-xl font-bold tracking-wide text-destructive sm:text-2xl'
    : 'text-2xl font-bold tracking-wide';

  const buttonClass = isGame
    ? type === 'success'
      ? 'cursor-pointer rounded-lg bg-gradient-to-r from-primary to-amber-600 px-5 py-2.5 font-semibold text-primary-foreground shadow-md transition hover:from-primary/90 hover:to-amber-500'
      : 'cursor-pointer rounded-lg border border-destructive/40 bg-destructive/10 px-5 py-2.5 font-semibold text-destructive transition hover:bg-destructive/20'
    : type === 'success'
      ? 'bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md cursor-pointer'
      : 'bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md cursor-pointer';

  const overlayClass = isGame ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/40';

  const bodyTextClass = isGame ? (type === 'error' ? 'text-foreground' : 'text-muted-foreground') : '';

  const describedBy = description || children || title ? descriptionId : undefined;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClass}`}
      role="presentation"
      aria-hidden={false}
      onClick={onClose}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`${backgroundClass} ${isGame ? 'rounded-xl' : 'rounded-2xl'} shadow-2xl w-[90%] max-w-lg p-6 sm:p-10 max-h-[90vh] overflow-y-auto outline-none focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {describedBy ? (
          <p id={descriptionId} className="sr-only">
            {description || `${title}. ${t('modalAdditionalContent')}`}
          </p>
        ) : null}
        <div className="mb-6 flex items-center justify-between">
          <h2 id={titleId} className={titleClass}>
            {title}
          </h2>
        </div>

        <div className={['mb-6', 'text-base', bodyTextClass || undefined].filter(Boolean).join(' ')}>
          {children}
        </div>

        {footer ? (
          <div className="mt-6">{footer}</div>
        ) : (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-lg transition duration-300 cursor-pointer ${buttonClass}`}
            >
              {t('close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
