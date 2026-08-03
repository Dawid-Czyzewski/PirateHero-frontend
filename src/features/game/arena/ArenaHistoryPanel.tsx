import { History, Play, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ArenaBattleHistoryEntry } from './arenaTypes';
import { ArenaHistorySkeleton } from './ArenaHistorySkeleton';

function formatBattleDateTime(date: Date, language: string): string {
  const locale = language.startsWith('pl') ? 'pl-PL' : 'en-GB';
  return date.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  history: ArenaBattleHistoryEntry[];
  onReplay: (entry: ArenaBattleHistoryEntry) => void;
  loading?: boolean;
};

export function ArenaHistoryPanel({ history, onReplay, loading = false }: Props) {
  const { t, i18n } = useTranslation();
  return (
    <div
      className="animate-fade-in rounded-xl border border-border/50 bg-gradient-to-b from-background/60 to-muted/15 p-4 shadow-sm backdrop-blur-[2px]"
      role={loading ? 'status' : undefined}
      aria-busy={loading || undefined}
      aria-live={loading ? 'polite' : undefined}
    >
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold tracking-wide">
        <History className="h-4 w-4 text-primary" aria-hidden />
        {t('arenaPage.historyTitle')}
      </h3>
      {loading ? (
        <div>
          <span className="sr-only">{t('arenaPage.historyLoading')}</span>
          <ArenaHistorySkeleton rows={5} />
        </div>
      ) : history.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">{t('arenaPage.historyEmpty')}</p>
      ) : (
        <ul className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
          {history.map((entry) => {
            const fame = entry.fameChange;
            const canReplay = Boolean(entry.fightId || entry.battleResult);
            return (
              <li
                key={String(entry.id)}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 p-3 shadow-sm transition-colors hover:border-primary/25 hover:bg-muted/25"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-xl shadow-inner"
                  aria-hidden
                >
                  {entry.won ? '🏆' : '💀'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-sm font-semibold">
                    {t('arenaPage.vs')} {entry.opponent.name}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    <span
                      className={
                        fame > 0
                          ? 'inline-flex items-center gap-1 rounded-md border border-purple-500/35 bg-purple-500/10 px-2 py-0.5 font-display text-[11px] font-semibold tabular-nums text-purple-200'
                          : fame < 0
                            ? 'inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-display text-[11px] font-semibold tabular-nums text-red-200/90'
                            : 'inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/20 px-2 py-0.5 font-display text-[11px] font-medium tabular-nums text-muted-foreground'
                      }
                      title={t('arenaPage.historyFameHint')}
                    >
                      <Star
                        className={
                          fame > 0
                            ? 'h-3 w-3 shrink-0 fill-purple-400/90 text-purple-400'
                            : 'h-3 w-3 shrink-0 text-muted-foreground/50'
                        }
                        aria-hidden
                      />
                      <span>
                        {fame > 0 ? `+${fame}` : fame}
                      </span>
                      <span className={fame > 0 ? 'font-normal text-purple-300/75' : 'font-normal'}>
                        {t('characterPage.fameLabel')}
                      </span>
                    </span>
                    <time
                      className="tabular-nums text-muted-foreground/90"
                      dateTime={entry.date.toISOString()}
                    >
                      {formatBattleDateTime(entry.date, i18n.language)}
                    </time>
                  </div>
                </div>
                {canReplay ? (
                  <button
                    type="button"
                    onClick={() => onReplay(entry)}
                    className="group/replay flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-primary/45 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent px-2.5 py-2 font-heading text-[9px] font-bold uppercase tracking-[0.14em] text-primary shadow-sm transition hover:border-primary hover:from-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 text-primary shadow-inner transition group-hover/replay:scale-105 group-hover/replay:bg-primary group-hover/replay:text-primary-foreground">
                      <Play className="h-3.5 w-3.5 fill-current pl-0.5" aria-hidden />
                    </span>
                    <span className="max-w-[4rem] text-center leading-tight">{t('arenaPage.replayBadge')}</span>
                  </button>
                ) : (
                  <div
                    className="flex max-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-border/40 bg-muted/15 px-2 py-2 text-center"
                    title={t('arenaPage.replayUnavailableHint')}
                  >
                    <span className="text-[9px] font-heading font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {t('arenaPage.replayUnavailable')}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
