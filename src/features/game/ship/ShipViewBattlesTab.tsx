import type { TFunction } from 'i18next';
import type { i18n as I18nType } from 'i18next';
import { Loader2, Ship, Star, Swords } from 'lucide-react';
import type { ShipFightOpponentRow } from '@/features/game/ship/useShipBattles';
import type { ShipBattleHistoryEntry } from '@/features/game/ship/shipTypes';
import { Button } from '@/features/game/ship/ShipUi';

export type ShipBattlesBundle = {
  opponents: ShipFightOpponentRow[];
  fightHistory: ShipBattleHistoryEntry[];
  loading: boolean;
  historyLoading: boolean;
  error: string | null;
  canStartFight: boolean;
  checkingCanStart: boolean;
  attackingOpponentId: string | null;
  fightFeedback:
    | { kind: 'result'; won: boolean }
    | { kind: 'error'; message: string }
    | null;
  isCaptain: boolean;
  onStartFight: (opponentShipId: string | number) => Promise<void>;
  onViewFight: (fightId: string | number) => Promise<void>;
  onViewShip: (shipId: string) => void;
};

type Props = {
  t: TFunction;
  i18n: I18nType;
  battles: ShipBattlesBundle;
};

export function ShipViewBattlesTab({ t, i18n, battles }: Props) {
  const {
    opponents,
    fightHistory,
    loading,
    historyLoading,
    error,
    canStartFight,
    checkingCanStart,
    attackingOpponentId,
    fightFeedback,
    isCaptain,
    onStartFight,
    onViewFight,
    onViewShip,
  } = battles;

  const attackBusy = Boolean(attackingOpponentId);

  return (
    <div className="space-y-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">
          {String(t('shipPage.battlesTitle'))}
        </h2>
        {!canStartFight && isCaptain && !loading && !checkingCanStart && (
          <span className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            {String(t('shipPage.attackUsedToday'))}
          </span>
        )}
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {fightFeedback?.kind === 'error' ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
          {fightFeedback.message}
        </p>
      ) : null}

      {fightFeedback?.kind === 'result' ? (
        <p
          className={`rounded-md border p-2 text-sm ${
            fightFeedback.won
              ? 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-destructive/40 bg-destructive/10 text-destructive'
          }`}
        >
          {fightFeedback.won ? String(t('shipPage.battleResultWin')) : String(t('shipPage.battleResultLoss'))}
        </p>
      ) : null}

      {!isCaptain ? (
        <p className="text-sm text-muted-foreground">{String(t('shipPage.battlesOwnerOnly'))}</p>
      ) : null}

      <details className="group mb-4 rounded-md border border-border bg-muted/20">
        <summary className="cursor-pointer list-none px-3 py-2 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span className="text-foreground/80 transition-transform group-open:rotate-90">▸</span>
            {String(t('shipPage.battleHistoryTitle'))}
          </span>
        </summary>
        <ul className="space-y-2 border-t border-border/60 px-3 py-3">
          {historyLoading ? (
            <li className="text-sm text-muted-foreground">{String(t('shipPage.battlesLoading'))}</li>
          ) : fightHistory.length === 0 ? (
            <li className="text-sm text-muted-foreground">{String(t('shipPage.battleHistoryEmpty'))}</li>
          ) : (
            fightHistory.map((h) => (
              <li
                key={h.id}
                className="flex flex-col gap-1 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-muted-foreground">
                  {new Date(h.at).toLocaleString(i18n.language, {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
                <span className="font-semibold text-foreground">{h.enemyName}</span>
                <span
                  className={
                    h.result === 'win' ? 'font-bold text-green-500' : 'font-bold text-destructive'
                  }
                >
                  {h.result === 'win'
                    ? String(t('shipPage.battleHistoryWin'))
                    : String(t('shipPage.battleHistoryLoss'))}
                </span>
                <span className="text-muted-foreground">
                  {String(
                    t('shipPage.battleHistoryFame', {
                      delta: h.fameDelta > 0 ? `+${h.fameDelta}` : String(h.fameDelta),
                    })
                  )}
                </span>
                <Button size="sm" variant="outline" onClick={() => void onViewFight(h.id)}>
                  {String(t('statekFights.showFight'))}
                </Button>
              </li>
            ))
          )}
        </ul>
      </details>

      {isCaptain && canStartFight ? (
        <p className="mb-2 text-xs text-muted-foreground">{String(t('shipPage.battlesHint'))}</p>
      ) : null}

      {isCaptain && (loading || checkingCanStart) ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          <span>{String(t('shipPage.battlesLoading'))}</span>
        </div>
      ) : null}

      {isCaptain && !loading && !checkingCanStart && !canStartFight ? (
        <div
          className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-4 text-center text-amber-100/95"
          role="status"
        >
          <p className="text-sm leading-relaxed sm:text-base">
            {String(t('shipPage.battlesOpponentsHiddenAfterQuota'))}
          </p>
        </div>
      ) : null}

      {isCaptain && canStartFight && !loading && !checkingCanStart
        ? opponents.map((e) => {
            const eid = String(e.id);
            const isThisAttack = attackingOpponentId !== null && attackingOpponentId === eid;
            return (
              <div
                key={eid}
                className="flex flex-col gap-2 rounded-md bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <Ship className="h-4 w-4 text-muted-foreground" /> {e.title}
                  </p>
                  <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <span>{String(t('shipPage.battleCrewSize', { count: e.memberCount ?? 0 }))}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3 text-purple-400" />
                      {e.totalFamePoints ?? 0}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => onViewShip(eid)}>
                    {String(t('shipPage.viewButton'))}
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={attackBusy}
                    className={attackBusy && !isThisAttack ? 'opacity-60' : ''}
                    onClick={() => void onStartFight(e.id)}
                  >
                    {isThisAttack ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 shrink-0 animate-spin" aria-hidden />
                        {String(t('shipPage.battleAttackStarting'))}
                      </span>
                    ) : (
                      <>
                        <Swords className="mr-1 h-3 w-3" /> {String(t('shipPage.attackButton'))}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        : null}

      {!isCaptain && !loading ? (
        <>
          <p className="mb-2 text-xs text-muted-foreground">{String(t('shipPage.battlesHint'))}</p>
          {opponents.map((e) => (
            <div
              key={String(e.id)}
              className="flex flex-col gap-2 rounded-md bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Ship className="h-4 w-4 text-muted-foreground" /> {e.title}
                </p>
                <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <span>{String(t('shipPage.battleCrewSize', { count: e.memberCount ?? 0 }))}</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-purple-400" />
                    {e.totalFamePoints ?? 0}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => onViewShip(String(e.id))}>
                  {String(t('shipPage.viewButton'))}
                </Button>
                <Button size="sm" variant="secondary" disabled>
                  <Swords className="mr-1 h-3 w-3" /> {String(t('shipPage.attackButton'))}
                </Button>
              </div>
            </div>
          ))}
        </>
      ) : null}

      {!isCaptain && loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          <span>{String(t('shipPage.battlesLoading'))}</span>
        </div>
      ) : null}
    </div>
  );
}
