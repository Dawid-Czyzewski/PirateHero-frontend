import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { playCoinFlip } from '@/services/coinFlipService';
import type { CoinFlipChoice, CoinFlipPlayResponse } from '@/types/coinFlip';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { coinFlipOutcomeLabel } from '@/features/game/coinFlip/coinFlipOutcomeLabel';
import { CoinFlipCoinDisplay } from '@/features/game/coinFlip/CoinFlipCoinDisplay';

function errorMessageKey(error: unknown): string {
  if (error instanceof ApiHttpError) return error.message;
  if (error instanceof Error) return error.message;
  return '';
}

export default function CoinFlipPage() {
  const { t } = useTranslation();
  const { fetchUserData, setUser } = useUser();

  usePageMeta({
    title: t('coinFlipPage.seoTitle'),
    description: t('coinFlipPage.seoDescription'),
    openGraph: true,
  });

  const [stake, setStake] = useState(1);
  const [choice, setChoice] = useState<CoinFlipChoice | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<CoinFlipPlayResponse | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const outcomeLabels = {
    heads: t('coinFlipPage.outcomeHeads'),
    tails: t('coinFlipPage.outcomeTails'),
  };

  const handleFlip = useCallback(async () => {
    if (choice === null) {
      setErrorKey('coinFlipChoiceInvalid');
      return;
    }

    setErrorKey(null);
    setLastResult(null);
    setIsFlipping(true);

    setUser((prev) => {
      if (!prev) return prev;
      const next = Math.max(0, prev.diamonds - stake);
      return { ...prev, diamonds: next };
    });

    try {
      const result = await playCoinFlip(stake, choice);
      setLastResult(result);
      await fetchUserData();
    } catch (e) {
      const key = errorMessageKey(e);
      setErrorKey(key && t(key) !== key ? key : 'coinFlipPage.playFailed');
      await fetchUserData();
    } finally {
      setIsFlipping(false);
    }
  }, [choice, fetchUserData, setUser, stake, t]);

  const controlsDisabled = isFlipping;

  return (
    <section className="w-full space-y-6" aria-label={t('coinFlipPage.pageAriaLabel')}>
      <h1 className={gamePageTitleH1Class}>{t('coinFlipPage.title')}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex min-h-[min(70vw,20rem)] items-center justify-center p-3 sm:min-h-[min(70svh,22rem)] sm:p-6">
          <CoinFlipCoinDisplay
            isFlipping={isFlipping}
            lastResult={lastResult}
            headsLabel={t('coinFlipPage.heads')}
            tailsLabel={t('coinFlipPage.tails')}
          />
        </div>

        <div className="min-w-0 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="coin-flip-stake" className="text-sm font-semibold text-foreground">
                {t('coinFlipPage.stakeLabel')}
              </label>
              <span className="tabular-nums text-sm font-bold text-blue-300">{stake}</span>
            </div>
            <input
              id="coin-flip-stake"
              type="range"
              min={1}
              max={10}
              step={1}
              value={stake}
              disabled={controlsDisabled}
              onChange={(e) => setStake(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <fieldset disabled={controlsDisabled} className="space-y-2 border-0 p-0">
            <legend className="text-sm font-semibold text-foreground">{t('coinFlipPage.sideLabel')}</legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setChoice('heads');
                  setErrorKey(null);
                }}
                className={`cursor-pointer rounded-lg border px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed ${
                  choice === 'heads'
                    ? 'border-primary/80 bg-primary/15 text-primary'
                    : 'border-border bg-background/50 text-foreground hover:border-primary/40'
                }`}
              >
                {t('coinFlipPage.heads')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChoice('tails');
                  setErrorKey(null);
                }}
                className={`cursor-pointer rounded-lg border px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed ${
                  choice === 'tails'
                    ? 'border-primary/80 bg-primary/15 text-primary'
                    : 'border-border bg-background/50 text-foreground hover:border-primary/40'
                }`}
              >
                {t('coinFlipPage.tails')}
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => void handleFlip()}
            disabled={controlsDisabled || choice === null}
            className="w-full cursor-pointer rounded-lg border-2 border-primary bg-primary px-4 py-3 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFlipping ? t('coinFlipPage.flipping') : t('coinFlipPage.flip')}
          </button>

          {choice === null && !isFlipping && (
            <p className="text-xs text-muted-foreground">{t('coinFlipPage.pickSideHint')}</p>
          )}

          {errorKey && (
            <p role="alert" className="text-sm text-destructive">
              {t(errorKey)}
            </p>
          )}

          {lastResult && !isFlipping && (
            <output
              className={`block rounded-lg border px-3 py-3 text-center text-sm font-semibold ${
                lastResult.won
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-border bg-muted/20 text-muted-foreground'
              }`}
              aria-label={t('coinFlipPage.lastOutcome')}
            >
              {lastResult.won
                ? t('coinFlipPage.resultWin', { payout: lastResult.payoutDiamonds })
                : t('coinFlipPage.resultLose', {
                    outcome: coinFlipOutcomeLabel(lastResult.outcome, outcomeLabels),
                  })}
            </output>
          )}
        </div>
      </div>
    </section>
  );
}
