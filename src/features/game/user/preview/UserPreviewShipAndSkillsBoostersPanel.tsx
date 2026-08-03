import { useMemo, type ComponentProps } from 'react';
import { Anchor, Briefcase, Compass, Ship, Sparkles, Star, Timer, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatBoosterActiveLabels, resolveDateLocale } from '@/features/game/boosters/boostersPageFormat';
import {
  getShopBoosterById,
  shopBoosterCategories,
  type ShopBoosterCategory,
} from '@/features/game/boosters/shopBoosterCatalog';
import { shopBoosterEffectLabel, shopBoosterName } from '@/features/game/boosters/shopBoosterI18n';
import type { ShopBoosterSessionEntry } from '@/features/game/boosters/sessionShopBoosterEffects';
import { gamePagePlayerTypedBodyCaseClass } from '@/features/game/layout/gamePageTitleClasses';
import { MAX_HULL_UPGRADE_LEVEL, MAX_UPGRADE_LEVEL } from '@/features/game/ship/shipConstants';
import type { UserPreviewData } from '@/types/preview';
import UserShipSection from './UserShipSection';

type Props = Omit<ComponentProps<typeof UserShipSection>, 'embedded'> & {
  userData: UserPreviewData;
};

function normalizePreviewShopBoosters(raw: UserPreviewData['sessionShopBoosters']): ShopBoosterSessionEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => ({
      boosterId: typeof e?.boosterId === 'string' ? e.boosterId : '',
      expiresAt: typeof e?.expiresAt === 'number' ? e.expiresAt : Number(e?.expiresAt) || 0,
    }))
    .filter((row) => row.boosterId !== '' && row.expiresAt > 0);
}

function findActiveInCategory(
  entries: ShopBoosterSessionEntry[],
  nowMs: number,
  category: ShopBoosterCategory
): { expiresAt: number; def: NonNullable<ReturnType<typeof getShopBoosterById>> } | null {
  for (const e of entries) {
    if (e.expiresAt <= nowMs) continue;
    const def = getShopBoosterById(e.boosterId);
    if (def?.category === category) return { expiresAt: e.expiresAt, def };
  }
  return null;
}

export function UserPreviewShipAndSkillsBoostersPanel({ userData, ...shipProps }: Props) {
  const { t, i18n } = useTranslation();
  const dateLocale = useMemo(() => resolveDateLocale(i18n.language), [i18n.language]);
  const entries = useMemo(() => normalizePreviewShopBoosters(userData.sessionShopBoosters), [userData.sessionShopBoosters]);
  const nowMs = Date.now();

  const skillsPct = Math.max(0, Number(userData.shipBonuses?.skills?.level ?? 0));
  const missionsPct = Math.max(0, Number(userData.shipBonuses?.missions?.level ?? 0));
  const workPct = Math.max(0, Number(userData.shipBonuses?.work?.level ?? 0));

  const isOwnProfile = Boolean(
    shipProps.currentUserId != null && String(userData.id) === String(shipProps.currentUserId)
  );
  const showNoShipInviteColumn = !userData.ship && Boolean(shipProps.isOwner) && !isOwnProfile;

  const card = 'rounded-lg border border-border bg-card/60 p-4 sm:p-5';
  const shipStatTile =
    'rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-sm shadow-sm shadow-black/10';
  const shipSummaryCard =
    'flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-3 text-sm shadow-sm shadow-black/10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-4';

  const hullUp = userData.ship ? Math.max(0, Number(userData.ship.hullUpgrade ?? 0)) : 0;
  const shipFame = userData.ship ? Math.max(0, Number(userData.ship.famePoints ?? 0)) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section className={card} aria-labelledby="user-preview-ship-title">
        <h2
          id="user-preview-ship-title"
          className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground"
        >
          <Ship className="h-4 w-4 shrink-0 text-primary" />
          {t('userPreviewPage.shipPanelTitle')}
        </h2>

        {userData.ship ? (
          <ul className="flex flex-col gap-2.5" aria-label={t('userPreviewPage.shipPanelTitle')}>
            <li>
              <article className={shipSummaryCard}>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Ship className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <p
                      className={`truncate text-base font-bold tracking-wide text-foreground ${gamePagePlayerTypedBodyCaseClass}`}
                    >
                      {userData.ship.title}
                    </p>
                  </div>
                  {typeof userData.ship.membersCount === 'number' && typeof userData.ship.maxMembers === 'number' ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 shrink-0 text-sky-300/90" aria-hidden />
                      <span className="text-sky-100/95">
                        {t('userPreviewPage.shipCrew', {
                          current: userData.ship.membersCount,
                          max: userData.ship.maxMembers,
                        })}
                      </span>
                    </div>
                  ) : null}
                  <div
                    className="flex flex-col items-start gap-0.5"
                    aria-label={t('userPreviewPage.shipFame', { count: shipFame })}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star className="h-5 w-5 shrink-0 text-purple-400" aria-hidden />
                      <span className="font-heading text-sm font-bold tabular-nums text-purple-300">{shipFame}</span>
                    </div>
                    <span className="text-[10px] text-purple-300/80">{t('characterPage.fameLabel')}</span>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 lg:w-auto lg:min-w-[9.5rem] lg:justify-center lg:border-l lg:border-border/50 lg:pl-4">
                  {shipProps.onViewShip ? (
                    <button
                      type="button"
                      onClick={() => shipProps.onViewShip!(userData.ship!.id)}
                      className="min-h-11 w-full cursor-pointer rounded-md bg-yellow-400 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm transition hover:bg-yellow-500 sm:text-sm"
                    >
                      {t('viewStatek')}
                    </button>
                  ) : null}
                  <UserShipSection
                    {...shipProps}
                    userData={userData}
                    embedded
                    suppressViewShipButton={Boolean(shipProps.onViewShip)}
                  />
                </div>
              </article>
            </li>
            <li>
              <div className={shipStatTile}>
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 shrink-0 ${skillsPct > 0 ? 'text-purple-400' : 'text-muted-foreground opacity-70'}`} aria-hidden />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${skillsPct > 0 ? 'text-purple-300' : 'text-muted-foreground'}`}
                  >
                    {t('shipPage.upgrades.skills.label')}
                  </span>
                </div>
                <p className={`pl-6 text-sm font-medium tabular-nums ${skillsPct > 0 ? 'text-violet-200/95' : 'text-muted-foreground'}`}>
                  {t('userPreviewPage.shipLevelsProgress', { current: skillsPct, max: MAX_UPGRADE_LEVEL })}
                </p>
              </div>
            </li>
            <li>
              <div className={shipStatTile}>
                <div className="mb-1 flex items-center gap-2">
                  <Compass className={`h-4 w-4 shrink-0 ${missionsPct > 0 ? 'text-emerald-400' : 'text-muted-foreground opacity-70'}`} aria-hidden />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${missionsPct > 0 ? 'text-emerald-300' : 'text-muted-foreground'}`}
                  >
                    {t('shipPage.upgrades.quests.label')}
                  </span>
                </div>
                <p className={`pl-6 text-sm font-medium tabular-nums ${missionsPct > 0 ? 'text-emerald-200/90' : 'text-muted-foreground'}`}>
                  {t('userPreviewPage.shipLevelsProgress', { current: missionsPct, max: MAX_UPGRADE_LEVEL })}
                </p>
              </div>
            </li>
            <li>
              <div className={shipStatTile}>
                <div className="mb-1 flex items-center gap-2">
                  <Briefcase className={`h-4 w-4 shrink-0 ${workPct > 0 ? 'text-amber-400' : 'text-muted-foreground opacity-70'}`} aria-hidden />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${workPct > 0 ? 'text-amber-300' : 'text-muted-foreground'}`}
                  >
                    {t('shipPage.upgrades.work.label')}
                  </span>
                </div>
                <p className={`pl-6 text-sm font-medium tabular-nums ${workPct > 0 ? 'text-amber-200/90' : 'text-muted-foreground'}`}>
                  {t('userPreviewPage.shipLevelsProgress', { current: workPct, max: MAX_UPGRADE_LEVEL })}
                </p>
              </div>
            </li>
            <li>
              <div className={shipStatTile}>
                <div className="mb-1 flex items-center gap-2">
                  <Anchor className={`h-4 w-4 shrink-0 ${hullUp > 0 ? 'text-cyan-400' : 'text-muted-foreground opacity-70'}`} aria-hidden />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${hullUp > 0 ? 'text-cyan-300' : 'text-muted-foreground'}`}
                  >
                    {t('shipPage.upgrades.hull.label')}
                  </span>
                </div>
                <p className={`pl-6 text-sm font-medium tabular-nums ${hullUp > 0 ? 'text-cyan-200/90' : 'text-muted-foreground'}`}>
                  {t('userPreviewPage.shipLevelsProgress', { current: hullUp, max: MAX_HULL_UPGRADE_LEVEL })}
                </p>
              </div>
            </li>
          </ul>
        ) : (
          <div
            className={
              showNoShipInviteColumn
                ? 'flex flex-col gap-3 rounded-lg border border-border/60 bg-background/40 p-3 shadow-sm shadow-black/10 sm:flex-row sm:items-start sm:justify-between sm:gap-4'
                : 'rounded-lg border border-border/60 bg-background/40 p-3 text-sm text-muted-foreground shadow-sm shadow-black/10'
            }
          >
            <p className={`mb-0 ${showNoShipInviteColumn ? 'min-w-0 flex-1 text-sm text-muted-foreground' : ''}`}>
              {t('userPreviewPage.shipNoShip')}
            </p>
            {showNoShipInviteColumn ? (
              <div className="w-full shrink-0 sm:w-auto sm:min-w-[11rem]">
                <UserShipSection {...shipProps} userData={userData} embedded />
              </div>
            ) : null}
          </div>
        )}
      </section>

      <section className={card} aria-labelledby="user-preview-shop-boosters-title">
        <h2
          id="user-preview-shop-boosters-title"
          className="mb-3 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-foreground"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-yellow-400" />
          {t('userPreviewPage.shopBoostersTitle')}
        </h2>
        <ul className="flex flex-col gap-2.5" aria-label={t('userPreviewPage.shopBoostersTitle')}>
          {shopBoosterCategories.map((cat) => {
            const active = findActiveInCategory(entries, nowMs, cat.id);
            const Icon = cat.icon;

            if (active) {
              const labels = formatBoosterActiveLabels(active.expiresAt, nowMs, dateLocale);
              return (
                <li key={cat.id}>
                  <article className="hero-zero-card flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon className={`h-4 w-4 shrink-0 ${cat.colorClass}`} aria-hidden />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${cat.colorClass}`}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Timer className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden />
                        <span className="font-semibold text-yellow-100">{shopBoosterName(t, active.def)}</span>
                      </div>
                      <span className="min-w-0 text-xs text-yellow-200/85">{shopBoosterEffectLabel(t, active.def)}</span>
                      {labels ? (
                        <span className="shrink-0 whitespace-nowrap text-[11px] text-yellow-300/95">
                          {t('boostersPage.activeUntilLine', { until: labels.until, countdown: labels.countdown })}
                        </span>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            }

            return (
              <li key={cat.id}>
                <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 opacity-70 ${cat.colorClass}`} aria-hidden />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${cat.colorClass}`}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="pl-6 text-xs text-muted-foreground">{t('userPreviewPage.shopBoosterCategoryEmpty')}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
