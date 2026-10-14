import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dices } from 'lucide-react';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { useUser } from '@/hooks/useUser';
import { playTavernDice, type TavernDicePlayResult } from '@/services/tavernService';

const MIN_STAKE = 10;
const MAX_STAKE = 500;

function errorMessageKey(error: unknown): string {
  if (error instanceof ApiHttpError) return error.message;
  if (error instanceof Error) return error.message;
  return '';
}

export function TavernDicePanel() {
  const { t } = useTranslation();
  const { setUser, fetchUserData } = useUser();
  const [stake, setStake] = useState(50);
  const [playing, setPlaying] = useState(false);
  const [lastResult, setLastResult] = useState<TavernDicePlayResult | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handlePlay = useCallback(async () => {
    setErrorKey(null);
    setLastResult(null);
    setPlaying(true);

    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, gold: Math.max(0, Number(prev.gold ?? 0) - stake) };
    });

    try {
      const result = await playTavernDice(stake);
      setLastResult(result);
      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, gold: result.goldAfter };
      });
    } catch (e) {
      const key = errorMessageKey(e);
      setErrorKey(key && t(key) !== key ? key : 'tavernPage.dice.playFailed');
      await fetchUserData();
    } finally {
      setPlaying(false);
    }
  }, [fetchUserData, setUser, stake, t]);

  return (
    <div className="space-y-4" aria-label={t('tavernPage.dice.ariaLabel')}>
      <div className="rounded-xl border border-border bg-card px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <Dices className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">{t('tavernPage.dice.subtitle')}</p>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="tavern-dice-stake" className="font-heading text-xs font-bold uppercase tracking-wide text-foreground">
              {t('tavernPage.dice.stakeLabel')}
            </label>
            <span className="font-heading text-sm font-black tabular-nums text-primary">{stake}</span>
          </div>
          <input
            id="tavern-dice-stake"
            type="range"
            min={MIN_STAKE}
            max={MAX_STAKE}
            step={10}
            value={stake}
            disabled={playing}
            onChange={(e) => setStake(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[hsl(42,80%,50%)] disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_STAKE}</span>
            <span>{MAX_STAKE}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handlePlay()}
          disabled={playing}
          className="mt-5 w-full cursor-pointer rounded-lg bg-primary px-4 py-3 font-heading text-xs uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playing ? t('tavernPage.dice.rolling') : t('tavernPage.dice.roll')}
        </button>
      </div>

      {errorKey ? (
        <p role="alert" className="text-sm text-destructive">
          {t(errorKey)}
        </p>
      ) : null}

      {lastResult && !playing ? (
        <output
          className={`block space-y-2 rounded-xl border px-4 py-4 text-center sm:px-5 ${
            lastResult.won
              ? 'border-primary/35 bg-primary/5'
              : lastResult.tied
                ? 'border-border bg-muted/30'
                : 'border-border bg-card'
          }`}
          aria-label={t('tavernPage.dice.lastOutcome')}
        >
          <p className="font-heading text-sm font-bold tabular-nums text-foreground">
            {t('tavernPage.dice.rolls', {
              player: lastResult.playerRoll,
              dealer: lastResult.dealerRoll,
            })}
          </p>
          <p
            className={`text-sm font-semibold ${
              lastResult.won ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {lastResult.won
              ? t('tavernPage.dice.resultWin', { payout: lastResult.payoutGold })
              : lastResult.tied
                ? t('tavernPage.dice.resultTie')
                : t('tavernPage.dice.resultLose')}
          </p>
        </output>
      ) : null}
    </div>
  );
}
