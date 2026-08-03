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
    if (!isOpen || variant === 'language') return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose, variant]);

  const isActive = (optValue: string) =>
    variant === 'language' ? optValue === langKey : optValue === value;

  // Language: always show PL/EN chips immediately next to the icon (no dropdown, no stretch).
  if (variant === 'language') {
    const chipOn = guestChrome
      ? 'border-primary bg-primary/15 text-primary'
      : 'border-yellow-400 bg-yellow-400/15 text-yellow-400';
    const chipOff = guestChrome
      ? 'border-border bg-muted/60 text-foreground/80 hover:border-primary/40'
      : 'border-yellow-400/40 bg-black text-yellow-100/80 hover:border-yellow-400/70';

    return (
      <div
        className={
          guestChrome
            ? 'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted/90 px-2 py-1 shadow-sm'
            : 'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-yellow-400/50 bg-black px-2 py-1 shadow-sm'
        }
        role="group"
        aria-label={ariaLabel}
      >
        <Icon
          className={
            guestChrome
              ? 'h-4 w-4 shrink-0 text-foreground/80'
              : 'h-4 w-4 shrink-0 text-yellow-400/90'
          }
          aria-hidden
        />
        {options.map((opt) => {
          const active = isActive(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              aria-label={opt.label}
              className={`min-h-9 min-w-9 cursor-pointer rounded-md border px-2.5 text-sm font-display uppercase tracking-wider transition-colors ${
                active ? chipOn : chipOff
              }`}
              onClick={() => onSelect(opt.value)}
            >
              {opt.trigger}
            </button>
          );
        })}
      </div>
    );
  }

  const triggerGuest =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/90 px-3 py-1.5 text-sm font-display uppercase tracking-wider text-foreground shadow-sm transition-colors hover:bg-muted';
  const triggerAuth =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-yellow-400/50 bg-black px-3 py-1.5 text-sm font-display uppercase tracking-wider text-yellow-400 shadow-sm transition-colors hover:border-yellow-400 hover:bg-yellow-400/5';

  const panelGuest =
    'absolute left-0 top-full z-[80] mt-1 min-w-[8rem] rounded-lg border border-border bg-card py-1 shadow-lg';
  const panelAuth =
    'absolute left-0 top-full z-[80] mt-1 min-w-[8rem] rounded-lg border border-yellow-400/40 bg-black py-1 shadow-lg shadow-black/40';

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
        <ul
          className={guestChrome ? panelGuest : panelAuth}
          role="listbox"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const active = isActive(opt.value);
            return (
              <li key={opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={guestChrome ? itemGuest(active) : itemAuth(active)}
                  onPointerDown={(e) => e.stopPropagation()}
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
