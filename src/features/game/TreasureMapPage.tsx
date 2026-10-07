import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Lock, Map } from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { patchUserFromRewardResponse } from '@/lib/game/patchUserFromRewardResponse';
import { queryKeys } from '@/lib/query/queryKeys';
import {
  claimTreasureMapChest,
  fetchTreasureMap,
  type TreasureMapStep,
} from '@/services/treasureMapService';

function stepLabel(
  step: TreasureMapStep,
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  const key = `treasureMapPage.step_${step.type}`;
  return t(key, { count: step.target });
}

export default function TreasureMapPage() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);

  usePageMeta({
    title: t('treasureMapPage.seoTitle'),
    description: t('treasureMapPage.seoDescription'),
  });

  const q = useQuery({
    queryKey: queryKeys.treasureMap(),
    queryFn: fetchTreasureMap,
  });

  const claim = useCallback(async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      const result = await claimTreasureMapChest();
      updateUser(patchUserFromRewardResponse(result.updatedUser));
      queryClient.setQueryData(queryKeys.treasureMap(), result.status);
      toast.success(
        t('treasureMapPage.claimSuccess', {
          gold: result.rewards.gold,
          diamonds: result.rewards.diamonds,
        })
      );
    } catch (err) {
      const msg =
        err instanceof ApiHttpError && err.message
          ? t(err.message)
          : t('treasureMapPage.claimFailed');
      toast.error(msg);
    } finally {
      setClaiming(false);
    }
  }, [claiming, queryClient, t, updateUser]);

  if (q.isPending) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('treasureMapPage.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      </section>
    );
  }

  if (q.isError || !q.data) {
    return (
      <section className="w-full space-y-4">
        <h1 className={gamePageTitleH1Class}>{t('treasureMapPage.title')}</h1>
        <p className="text-sm text-destructive">{t('treasureMapPage.loadFailed')}</p>
      </section>
    );
  }

  const status = q.data;

  return (
    <section className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Map className="h-5 w-5 text-primary" aria-hidden />
        <h1 className={gamePageTitleH1Class}>{t('treasureMapPage.title')}</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {t('treasureMapPage.subtitle')} · {status.weekStart} – {status.weekEnd}
      </p>

      <ul className="space-y-2">
        {status.steps.map((step) => (
          <li
            key={step.slot}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
              step.current ? 'border-primary/40 bg-primary/5' : 'border-border/40 bg-card/30'
            }`}
          >
            {step.complete ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            ) : step.unlocked ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary text-[10px]">
                {step.slot}
              </span>
            ) : (
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{stepLabel(step, t)}</p>
              <p className="text-xs text-muted-foreground">
                {step.complete
                  ? t('treasureMapPage.stepDone')
                  : !step.unlocked
                    ? t('treasureMapPage.stepLocked')
                    : `${step.progress} / ${step.target}`}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        {status.chestClaimed ? (
          <span className="text-sm text-emerald-400">{t('treasureMapPage.claimed')}</span>
        ) : (
          <button
            type="button"
            disabled={!status.canClaim || claiming}
            onClick={() => void claim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {claiming ? t('loading') : t('treasureMapPage.claimChest')}
          </button>
        )}
        <span className="text-xs text-muted-foreground">
          +{status.rewards.gold} gold · +{status.rewards.diamonds} diamonds
        </span>
      </div>
    </section>
  );
}
