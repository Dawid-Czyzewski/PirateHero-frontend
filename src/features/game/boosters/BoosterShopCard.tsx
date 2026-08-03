import { Coins, Gem, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  normalizeShopBoosterPublicCode,
  type ShopBoosterDefinition,
} from '@/features/game/boosters/shopBoosterCatalog';
import type { ShopBoosterSessionEntry } from '@/features/game/boosters/sessionShopBoosterEffects';
import { shopBoosterDescription, shopBoosterEffectLabel, shopBoosterName } from '@/features/game/boosters/shopBoosterI18n';
import { formatBoosterActiveLabels, formatShopBoosterDurationHours, resolveDateLocale } from '@/features/game/boosters/boostersPageFormat';

type Props = {
  booster: ShopBoosterDefinition;
  gold: number;
  premium: number;
  nowMs: number;
  entries: ShopBoosterSessionEntry[];
  onBuy: (booster: ShopBoosterDefinition) => void;
};

export function BoosterShopCard({ booster, gold, premium, nowMs, entries, onBuy }: Props) {
  const { t, i18n } = useTranslation();
  const dateLocale = resolveDateLocale(i18n.language);

  const isPremium = booster.currency === 'premium';
  const active = entries.some(
    (e) => normalizeShopBoosterPublicCode(e.boosterId) === booster.id && e.expiresAt > nowMs
  );
  const activeEntryHit = entries.find(
    (e) => normalizeShopBoosterPublicCode(e.boosterId) === booster.id && e.expiresAt > nowMs
  );
  const activeLabels =
    activeEntryHit != null ? formatBoosterActiveLabels(activeEntryHit.expiresAt, nowMs, dateLocale) : null;

  const hasEnoughCurrency = isPremium ? premium >= booster.price : gold >= booster.price;
  const isDisabled = active || !hasEnoughCurrency;

  const buyLabel = t('boostersPage.purchaseBuy');
  const activeLabel = t('boostersPage.purchaseActive');
  const noCurrencyLabel = isPremium
    ? t('boostersPage.purchaseNoDiamonds')
    : t('boostersPage.purchaseNoGold');
  const noCurrencyLabelShort = isPremium
    ? t('boostersPage.purchaseNoDiamondsShort')
    : t('boostersPage.purchaseNoGoldShort');

  return (
    <article
      className={`rounded-xl border p-3 transition sm:p-4 ${
        isPremium
          ? 'border-blue-500/35 bg-gradient-to-b from-blue-900/25 to-black/30'
          : 'border-yellow-400/20 bg-gradient-to-b from-yellow-900/10 to-black/30'
      } ${active ? 'ring-2 ring-yellow-400/50' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold uppercase leading-snug text-white sm:text-base sm:normal-case">
            {shopBoosterName(t, booster)}
          </h3>
          <p className="mt-1 text-xs leading-snug text-gray-300 sm:text-sm">
            {shopBoosterDescription(t, booster)}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
            isPremium ? 'bg-blue-500/25 text-blue-200' : 'bg-yellow-500/20 text-yellow-200'
          }`}
        >
          {isPremium ? <Gem className="h-3.5 w-3.5 text-blue-300" /> : <Coins className="h-3.5 w-3.5" />}
          {booster.price}
        </span>
      </div>

      <div
        className={`flex flex-col gap-1 text-sm text-gray-200 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 ${
          active ? 'mb-2' : 'mb-3 sm:mb-4'
        }`}
      >
        <span className="shrink-0 text-gray-400">
          {formatShopBoosterDurationHours(booster.durationHours, t)}
        </span>
        <span className="min-w-0 break-words leading-snug">{shopBoosterEffectLabel(t, booster)}</span>
      </div>

      {active && activeLabels ? (
        <p className="mb-3 text-xs leading-snug text-yellow-200/90 sm:mb-4">
          {t('boostersPage.cardActiveUntil', { until: activeLabels.until, countdown: activeLabels.countdown })}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => onBuy(booster)}
        disabled={isDisabled}
        className={`w-full cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 ${
          isPremium
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500'
            : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400'
        }`}
      >
        {active ? (
          <span className="flex w-full flex-col items-center gap-0.5">
            <span className="inline-flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {activeLabel}
            </span>
            {activeLabels ? (
              <span className="text-center text-[11px] font-normal leading-tight opacity-90">
                {activeLabels.countdown}
              </span>
            ) : null}
          </span>
        ) : !hasEnoughCurrency ? (
          <>
            <span className="sm:hidden">{noCurrencyLabelShort}</span>
            <span className="hidden sm:inline">{noCurrencyLabel}</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5">{buyLabel}</span>
        )}
      </button>
    </article>
  );
}
