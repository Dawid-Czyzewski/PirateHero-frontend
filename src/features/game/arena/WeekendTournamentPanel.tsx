import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Coins, Gem, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  claimWeekendTournament,
  fetchWeekendTournament,
} from '@/services/weekendTournamentService';

export function WeekendTournamentPanel() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);

  const q = useQuery({
    queryKey: queryKeys.weekendTournament(),
    queryFn: fetchWeekendTournament,
    staleTime: 15_000,
  });

  const onClaim = useCallback(async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const result = await claimWeekendTournament();
      updateUser(patchUserFromRewardResponse(result.updatedUser));
      queryClient.setQueryData(queryKeys.weekendTournament(), result.status);
      toast.success(
        t('weekendTournament.claimSuccess', {
          gold: result.rewards.gold,
          diamonds: result.rewards.diamonds,
        })
      );
      if (result.titleGranted) {
        toast.success(t('weekendTournament.titleUnlocked'));
      }
    } catch (err) {
      const msg =
        err instanceof ApiHttpError && err.message
          ? t(err.message)
          : t('weekendTournament.claimFailed');
      toast.error(msg);
    } finally {
      setClaiming(false);
    }
  }, [claiming, queryClient, t, updateUser]);

  if (q.isPending || q.isError || !q.data) {
    return null;
  }

  const status = q.data;

  return (
    <section className="space-y-2 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-400" aria-hidden />
        <h2 className="text-sm font-semibold text-foreground">{t('weekendTournament.title')}</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {status.active
            ? t('weekendTournament.live')
            : t('weekendTournament.closed')}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('weekendTournament.window', { start: status.eventStart, end: status.eventEnd })}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span>
          {t('weekendTournament.points', { points: status.points })}
        </span>
        {status.rank != null ? (
          <span>{t('weekendTournament.rank', { rank: status.rank })}</span>
        ) : null}
        <span className="inline-flex items-center gap-0.5 text-muted-foreground">
          <Coins className="h-3 w-3 text-primary" aria-hidden />
          {status.rewards.gold}
        </span>
        <span className="inline-flex items-center gap-0.5 text-muted-foreground">
          <Gem className="h-3 w-3 text-blue-400" aria-hidden />
          {status.rewards.diamonds}
        </span>
      </div>
      {status.leaderboard.length > 0 ? (
        <ol className="max-h-28 space-y-0.5 overflow-y-auto text-[11px] text-muted-foreground">
          {status.leaderboard.slice(0, 10).map((e) => (
            <li key={`${e.rank}-${e.userId ?? e.username}`} className="flex justify-between gap-2">
              <span>
                #{e.rank} {e.username ?? '—'}
              </span>
              <span>{e.points}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[11px] text-muted-foreground">{t('weekendTournament.emptyBoard')}</p>
      )}
      {status.rewardClaimed ? (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {t('weekendTournament.claimed')}
        </span>
      ) : (
        <button
          type="button"
          disabled={!status.canClaim || claiming}
          onClick={() => void onClaim()}
          className="rounded-md bg-amber-500/90 px-2.5 py-1 text-[11px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {claiming ? t('loading') : t('weekendTournament.claim')}
        </button>
      )}
    </section>
  );
}
