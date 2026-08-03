import { useLayoutEffect, useRef } from 'react';
import type { TFunction } from 'react-i18next';
import type { ArenaBattleLog as ArenaBattleLogEntry } from './arenaTypes';

type Props = {
  t: TFunction;
  logs: ArenaBattleLogEntry[];
  visibleCount: number;
  opponentName: string;
  playerUsername?: string;
  battlePhase: 'fighting' | 'result' | null;
};

function displayNameForLog(nick: string | undefined, isYou: boolean, youLabel: string): string {
  if (isYou) return youLabel;
  return (nick ?? '').trim() || youLabel;
}

export function ArenaBattleLogPanel({
  t,
  logs,
  visibleCount,
  opponentName,
  playerUsername = '',
  battlePhase,
}: Props) {
  const logScrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = logScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [visibleCount, logs.length, battlePhase]);

  return (
    <div className="w-full border-t border-border bg-card">
      <div
        ref={logScrollRef}
        className="mx-auto max-h-40 w-full max-w-7xl space-y-2 overflow-y-auto px-4 py-3 sm:max-h-48 sm:px-10 sm:py-4 xl:max-h-56"
      >
        {logs.slice(0, visibleCount).map((log, i) => {
          const selfLabel =
            playerUsername.trim() || String(t('arenaPage.you'));
          const pu = playerUsername.trim();
          const strikerNick = log.strikerName?.trim();
          const targetNick = log.targetName?.trim();
          const strikerIsYou =
            log.attackerIsPlayer || (pu.length > 0 && strikerNick === pu);
          const targetIsYou =
            !log.attackerIsPlayer || (pu.length > 0 && targetNick === pu);
          const striker = displayNameForLog(strikerNick, strikerIsYou, selfLabel);
          const target = displayNameForLog(targetNick, targetIsYou, selfLabel);

          const hasNarrative = Boolean(strikerNick && targetNick);
          const compactAttacker = log.attackerIsPlayer ? selfLabel : opponentName;
          const line = log.dodge
            ? hasNarrative
              ? t('arenaPage.logDodgeNarrative', { striker, target })
              : t('arenaPage.dodgeLog')
            : log.critical
              ? hasNarrative
                ? t('arenaPage.logHitCrit', { striker, target, n: log.damage })
                : `${compactAttacker} → ${t('arenaPage.damageAmount', { n: log.damage })} ${t('arenaPage.critical')}`
              : hasNarrative
                ? t('arenaPage.logHit', { striker, target, n: log.damage })
                : `${compactAttacker} → ${t('arenaPage.damageAmount', { n: log.damage })}`;

          return (
            <div
              key={`${i}-${log.attackerIsPlayer}-${log.damage}-${log.dodge ? 'd' : 'h'}`}
              className={`rounded-md px-4 py-2 text-sm ${
                log.attackerIsPlayer ? 'bg-secondary/10' : 'bg-accent/10'
              }`}
            >
              <span className={log.critical && !log.dodge ? 'font-bold text-primary' : ''}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
