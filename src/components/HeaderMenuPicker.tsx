import { useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';

export const LANGUAGE_OPTIONS = [
  { value: 'pl', trigger: 'PL', label: 'PL - POLSKI' },
  { value: 'en', trigger: 'EN', label: 'EN - ENGLISH' },
] as const;

export const SERVER_OPTIONS = [{ value: 'PL1', trigger: 'PL1', label: 'PL1' }] as const;

type Option = { value: string; trigger: string; label: string };

type HeaderMenuPickerProps = {
  guestChrome: boolean;
  variant: 'language' | 'server';
  ariaLabel: string;
  icon: LucideIcon;
  value: string;
  options: readonly Option[];
  onSelect: (value: string) => void;
  isOpen: boolean;
  onOpenToggle: () => void;
  onClose: () => void;
};

export function HeaderMenuPicker({
  guestChrome,
  variant,
  ariaLabel,
  icon: Icon,
  value,
  options,
  onSelect,
  isOpen,
  onOpenToggle,
  onClose,
}: HeaderMenuPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const langKey = value.split('-')[0]?.toLowerCase().slice(0, 2) ?? 'en';
  const current =
    variant === 'language'
      ? options.find((o) => o.value === langKey) ?? options[0]
      : options.find((o) => o.value === value) ?? options[0];
  const triggerText = current?.trigger ?? value.toUpperCase();

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const triggerGuest =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/90 px-3 py-1.5 text-sm font-display uppercase tracking-wider text-foreground shadow-sm transition-colors hover:bg-muted';
  const triggerAuth =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-yellow-400/50 bg-black px-3 py-1.5 text-sm font-display uppercase tracking-wider text-yellow-400 shadow-sm transition-colors hover:border-yellow-400 hover:bg-yellow-400/5';

  const panelGuest =
    'absolute right-0 top-full z-[80] mt-1 min-w-[13.5rem] rounded-lg border border-border bg-card py-1 shadow-lg';
  const panelAuth =
    'absolute right-0 top-full z-[80] mt-1 min-w-[13.5rem] rounded-lg border border-yellow-400/40 bg-black py-1 shadow-lg shadow-black/40';

  const itemGuest = (active: boolean) =>
    `block w-full cursor-pointer px-4 py-2.5 text-left text-sm font-display uppercase tracking-wide transition-colors ${
      active
        ? 'text-primary'
        : 'text-foreground/90 hover:bg-muted/80 hover:text-foreground'
    }`;
  const itemAuth = (active: boolean) =>
    `block w-full cursor-pointer px-4 py-2.5 text-left text-sm font-display uppercase tracking-wide transition-colors ${
      active
        ? 'text-yellow-400'
        : 'text-yellow-100/90 hover:bg-yellow-400/10 hover:text-yellow-300'
    }`;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className={guestChrome ? triggerGuest : triggerAuth}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={onOpenToggle}
      >
        <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
        <span>{triggerText}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        )}
      </button>
      {isOpen && (
        <ul className={guestChrome ? panelGuest : panelAuth} role="listbox">
          {options.map((opt) => {
            const active =
              variant === 'language' ? opt.value === langKey : opt.value === value;
            return (
              <li key={opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={guestChrome ? itemGuest(active) : itemAuth(active)}
                  onClick={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
