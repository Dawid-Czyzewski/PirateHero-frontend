import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import { queryKeys } from '@/lib/query/queryKeys';
import { fetchBestiaryTrophies } from '@/services/bestiaryTrophyService';
import { useUser } from '@/hooks/useUser';

export function DungeonsHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUser();

  const trophiesQuery = useQuery({
    queryKey: queryKeys.bestiaryTrophies(),
    queryFn: fetchBestiaryTrophies,
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });
  const unclaimed = trophiesQuery.data?.unclaimedCount ?? 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className={gamePageTitleH1Class}>{t('dungeons')}</h1>
      <button
        type="button"
        onClick={() => navigate('/game/bestiary')}
        className="relative inline-flex cursor-pointer items-center rounded-lg border border-primary/30 bg-card px-3 py-2 font-heading text-xs font-bold uppercase tracking-wider text-primary transition hover:border-primary/50 hover:bg-primary/10 sm:text-sm"
      >
        {t('bestiaryPage.openFromDungeons')}
        {unclaimed > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">
            {unclaimed}
          </span>
        ) : null}
      </button>
    </div>
  );
}
