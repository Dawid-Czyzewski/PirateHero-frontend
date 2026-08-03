import { Gem, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PremiumDiamondPack } from './premiumShopCatalog';

type Props = {
  pack: PremiumDiamondPack;
  onSelect: (pack: PremiumDiamondPack) => void;
};

function GemPile({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const main =
    size === 'lg' ? 'h-14 w-14' : size === 'md' ? 'h-11 w-11' : 'h-9 w-9';
  const side =
    size === 'lg' ? 'h-10 w-10' : size === 'md' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <div className="relative mx-auto flex h-20 w-24 items-end justify-center" aria-hidden>
      <Gem className={`absolute bottom-0 left-2 ${side} text-cyan-400/70 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]`} />
      <Gem className={`absolute bottom-1 right-1 ${side} text-blue-300/80 drop-shadow-[0_0_8px_rgba(96,165,250,0.45)]`} />
      <Gem className={`relative z-10 ${main} text-blue-200 drop-shadow-[0_0_12px_rgba(147,197,253,0.55)]`} />
    </div>
  );
}

export function PremiumDiamondPackCard({ pack, onSelect }: Props) {
  const { t } = useTranslation();
  const total = pack.totalDiamonds;
  const bonusAmount = total - pack.diamonds;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border-2 bg-gradient-to-b from-[hsl(220,35%,14%)] to-[hsl(220,30%,8%)] p-4 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
        pack.badge === 'bestValue'
          ? 'border-amber-400/60 ring-1 ring-amber-400/30'
          : 'border-blue-500/25 hover:border-blue-400/45'
      }`}
    >
      {pack.badge ? (
        <span
          className={`absolute right-0 top-0 rounded-bl-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
            pack.badge === 'bestValue'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black'
              : 'bg-gradient-to-r from-rose-600 to-rose-500 text-white'
          }`}
        >
          {pack.badge === 'bestValue'
            ? t('premiumShopPage.badgeBestValue')
            : t('premiumShopPage.badgePopular')}
        </span>
      ) : null}

      <GemPile size={pack.diamonds >= 600 ? 'lg' : pack.diamonds >= 200 ? 'md' : 'sm'} />

      <div className="mt-2 text-center">
        <p className="font-heading text-2xl font-black tabular-nums text-blue-100">
          {total.toLocaleString()}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-300/80">
          {t('diamonds')}
        </p>
        {bonusAmount > 0 ? (
          <p className="mt-1 text-[11px] font-bold text-emerald-400">
            {t('premiumShopPage.bonusFree', { percent: pack.bonusPercent })}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onSelect(pack)}
        className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-3 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-md transition group-hover:from-blue-500 group-hover:to-cyan-500"
      >
        {t('premiumShopPage.buyFor', { price: pack.pricePln.toFixed(2) })}
      </button>
    </article>
  );
}

export function PremiumFeaturedPackCard({
  diamonds,
  gold,
  pricePln,
  onSelect,
}: {
  diamonds: number;
  gold: number;
  pricePln: number;
  onSelect: () => void;
}) {
  const { t } = useTranslation();

  return (
    <article className="relative overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/80 via-[hsl(220,30%,10%)] to-blue-950/60 p-5 shadow-2xl sm:p-6">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl"
        aria-hidden
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-center lg:w-36">
          <div className="relative">
            <Sparkles className="absolute -left-4 -top-2 h-6 w-6 text-amber-300/80" aria-hidden />
            <Gem className="h-20 w-20 text-blue-200 drop-shadow-[0_0_20px_rgba(147,197,253,0.5)] sm:h-24 sm:w-24" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
            {t('premiumShopPage.oneTimeOffer')}
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold text-amber-200 sm:text-2xl">
            {t('premiumShopPage.featured.title')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('premiumShopPage.featured.subtitle')}</p>

          <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
            <li className="flex items-center gap-2">
              <Gem className="h-4 w-4 shrink-0 text-blue-300" />
              <span>
                <strong className="text-blue-200">{diamonds}</strong> {t('diamonds')}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base" aria-hidden>
                🪙
              </span>
              <span>
                <strong className="text-amber-200">{gold.toLocaleString()}</strong> {t('gold')}
              </span>
            </li>
            <li className="text-xs text-emerald-400/90">{t('premiumShopPage.featured.bonusItem')}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end lg:w-44">
          <button
            type="button"
            onClick={onSelect}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg transition hover:from-amber-400 hover:to-yellow-300"
          >
            {t('premiumShopPage.buyFor', { price: pricePln.toFixed(2) })}
          </button>
          <p className="text-center text-[10px] text-muted-foreground lg:text-right">
            {t('premiumShopPage.featured.levelHint')}
          </p>
        </div>
      </div>
    </article>
  );
}
