import { createPortal } from 'react-dom';
import { Gem, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  title: string;
  diamonds: number;
  pricePln: number;
  onClose: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

export function PremiumShopConfirmModal({
  isOpen,
  title,
  diamonds,
  pricePln,
  onClose,
  onConfirm,
  confirmDisabled = false,
}: Props) {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-shop-confirm-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-blue-500/30 bg-card/95 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 cursor-pointer rounded-md p-1 text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
          aria-label={t('close')}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex flex-col items-center text-center">
          <Gem className="mb-3 h-12 w-12 text-blue-300" aria-hidden />
          <h2 id="premium-shop-confirm-title" className="font-heading text-xl font-bold text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('premiumShopPage.confirm.subtitle')}</p>
        </div>

        <div className="mb-6 rounded-lg border border-border/60 bg-muted/20 p-4 text-center">
          <p className="text-3xl font-black tabular-nums text-blue-200">{diamonds.toLocaleString()}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('diamonds')}</p>
          <p className="mt-3 text-lg font-bold text-foreground">
            {t('premiumShopPage.buyFor', { price: pricePln.toFixed(2) })}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/50"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="flex-1 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-black uppercase tracking-wide text-white transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t('premiumShopPage.confirm.button')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
