import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Bird } from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { queryKeys } from '@/lib/query/queryKeys';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { CompanionCard } from '@/features/game/companion/CompanionCard';
import {
  equipCompanion,
  feedCompanion,
  fetchCompanionStatus,
  unequipCompanion,
  useCompanionAbility,
  type CompanionStatus,
} from '@/services/companionService';

function actionErrorMessage(
  err: unknown,
  t: (key: string) => string,
  fallbackKey: string
): string {
  if (err instanceof ApiHttpError && err.message) {
    return t(err.message);
  }
  return t(fallbackKey);
}

export default function CompanionPage() {
  const { t } = useTranslation();
  const { user, fetchUserData } = useUser();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  usePageMeta({
    title: t('companionPage.seoTitle'),
    description: t('companionPage.seoDescription'),
    openGraph: true,
  });

  const q = useQuery({
    queryKey: queryKeys.companion(),
    queryFn: fetchCompanionStatus,
  });

  const setStatus = useCallback(
    (next: CompanionStatus) => {
      queryClient.setQueryData(queryKeys.companion(), next);
    },
    [queryClient]
  );

  const runAction = useCallback(
    async (key: string, fn: () => Promise<void>) => {
      if (busy) return;
      setBusy(key);
      try {
        await fn();
      } finally {
        setBusy(null);
      }
    },
    [busy]
  );

  const onFeed = (code: string) =>
    void runAction(`feed:${code}`, async () => {
      try {
        const next = await feedCompanion(code);
        setStatus(next);
        await fetchUserData();
        toast.success(t('companionPage.feedSuccess'));
      } catch (err) {
        toast.error(actionErrorMessage(err, t, 'companionPage.actionFailed'));
      }
    });

  const onEquip = (code: string) =>
    void runAction(`equip:${code}`, async () => {
      try {
        const result = await equipCompanion(code);
        const prev = queryClient.getQueryData<CompanionStatus>(queryKeys.companion());
        if (prev) {
          setStatus({
            ...prev,
            equippedCode: result.equippedCode,
          });
        } else {
          await queryClient.invalidateQueries({ queryKey: queryKeys.companion() });
        }
        toast.success(t('companionPage.equipSuccess'));
      } catch (err) {
        toast.error(actionErrorMessage(err, t, 'companionPage.actionFailed'));
      }
    });

  const onUnequip = () =>
    void runAction('unequip', async () => {
      try {
        await unequipCompanion();
        const prev = queryClient.getQueryData<CompanionStatus>(queryKeys.companion());
        if (prev) {
          setStatus({
            ...prev,
            equippedCode: null,
          });
        } else {
          await queryClient.invalidateQueries({ queryKey: queryKeys.companion() });
        }
        toast.success(t('companionPage.unequipSuccess'));
      } catch (err) {
        toast.error(actionErrorMessage(err, t, 'companionPage.actionFailed'));
      }
    });

  const onAbility = () =>
    void runAction('ability', async () => {
      try {
        const next = await useCompanionAbility();
        setStatus(next);
        await fetchUserData();
        if (next.message) {
          toast.success(t(next.message));
        } else {
          toast.success(t('companionPage.abilitySuccess'));
        }
      } catch (err) {
        toast.error(actionErrorMessage(err, t, 'companionPage.actionFailed'));
      }
    });

  const gold = user?.gold ?? 0;
  const playerLevel = Number(user?.level?.name ?? 0);

  return (
    <section
      className="mx-auto w-full max-w-lg space-y-4 px-2 py-4 sm:px-4"
      aria-label={t('companionPage.pageAriaLabel')}
    >
      <header className="flex flex-col items-start gap-2">
        <Link
          to="/game/character"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          {t('character')}
        </Link>
        <div className="flex items-center gap-2">
          <Bird className="h-5 w-5 text-primary" aria-hidden />
          <h1 className={gamePageTitleH1Class}>{t('companionPage.title')}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t('companionPage.subtitle')}</p>
      </header>

      {q.isPending ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : null}

      {q.isError || (!q.isPending && !q.data) ? (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{t('companionPage.loadFailed')}</p>
          <button
            type="button"
            className="text-sm font-semibold text-primary underline"
            onClick={() => void q.refetch()}
          >
            {t('companionPage.retry')}
          </button>
        </div>
      ) : null}

      {q.data ? (
        <div className="flex flex-col gap-4 md:gap-5">
          {q.data.companions.map((companion) => (
            <CompanionCard
              key={companion.code}
              companion={companion}
              equippedCode={q.data.equippedCode}
              abilityReady={q.data.abilityReady}
              gold={gold}
              playerLevel={playerLevel}
              busy={busy}
              onFeed={() => onFeed(companion.code)}
              onEquip={() => onEquip(companion.code)}
              onUnequip={onUnequip}
              onAbility={onAbility}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
