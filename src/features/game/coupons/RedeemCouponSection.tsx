import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Gift } from 'lucide-react';

export type RedeemCouponSectionProps = {
  code: string;
  onCodeChange: (code: string) => void;
  onRedeem: () => void;
  loading: boolean;
  disabled?: boolean;
};

const MAX_CODE_LEN = 32;

export function RedeemCouponSection({
  code,
  onCodeChange,
  onRedeem,
  loading,
  disabled = false,
}: RedeemCouponSectionProps) {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loading && !disabled) onRedeem();
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="coupon-code-input">
          {t('enterCouponCode')}
        </label>
        <input
          id="coupon-code-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={MAX_CODE_LEN}
          value={code}
          onChange={(e) => onCodeChange(e.target.value.slice(0, MAX_CODE_LEN).toUpperCase())}
          placeholder={t('enterCouponCode')}
          disabled={loading || disabled}
          className="min-h-11 flex-1 rounded-lg border border-border bg-muted/50 px-4 py-3 font-mono text-base tracking-widest text-foreground uppercase placeholder:text-muted-foreground placeholder:normal-case focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || disabled || !code.trim()}
          className="flex min-h-11 min-w-[140px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-amber-600 px-6 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-md transition hover:from-primary/90 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                aria-hidden
              />
              {t('redeeming')}
            </>
          ) : (
            <>
              <Gift className="h-4 w-4 shrink-0" aria-hidden />
              {t('redeem')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default RedeemCouponSection;
