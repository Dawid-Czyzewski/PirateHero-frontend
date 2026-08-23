import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArenaRouteSkeleton } from '@/features/game/arena/ArenaRouteSkeleton';
import { ShipRouteSkeleton } from '@/features/game/ship/ShipRouteSkeleton';
import { gameRouteImports } from './gameLazyRoutes';
import type { GameOutletContext } from './GameOutletContext';

const MissionsPage = lazy(gameRouteImports.missions);
const QuestTasksPage = lazy(gameRouteImports.questTasks);
const DailyChallengesPage = lazy(gameRouteImports.dailyChallenges);
const WeeklyContractPage = lazy(gameRouteImports.weeklyContract);
const StorePage = lazy(gameRouteImports.store);
const CharacterPage = lazy(gameRouteImports.character);
const FightsPage = lazy(gameRouteImports.fights);
const DungeonsPage = lazy(gameRouteImports.dungeons);
const BestiaryPage = lazy(gameRouteImports.bestiary);
const BestiaryEntryPage = lazy(gameRouteImports.bestiaryEntry);
const ShipPage = lazy(gameRouteImports.ship);
const UserPreviewPage = lazy(gameRouteImports.userPreview);
const ShipPreviewPage = lazy(gameRouteImports.shipPreview);
const RankingPage = lazy(gameRouteImports.ranking);
const NotificationsPage = lazy(gameRouteImports.notifications);
const BoostersPage = lazy(gameRouteImports.boosters);
const CouponPage = lazy(gameRouteImports.coupons);
const CoinFlipPage = lazy(gameRouteImports.coinFlip);
const PremiumShopPage = lazy(gameRouteImports.premiumShop);
const SettingsPage = lazy(gameRouteImports.settings);
const TitlesPage = lazy(gameRouteImports.titles);

export function MissionsOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return (
    <MissionsPage goBack={ctx.goBackToMenu} onQuestsUpdated={ctx.onQuestsUpdated} />
  );
}

export function QuestTasksOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return <QuestTasksPage goBack={ctx.goBackToMenu} onRewardClaimed={ctx.onRewardClaimed} />;
}

export function DailyChallengesOutlet() {
  return <DailyChallengesPage />;
}

export function WeeklyContractOutlet() {
  return <WeeklyContractPage />;
}

export function StoreOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return <StorePage onQuestsUpdated={ctx.onQuestsUpdated} />;
}

export function FightsOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return (
    <Suspense fallback={<ArenaRouteSkeleton />}>
      <FightsPage onQuestsUpdated={ctx.onQuestsUpdated} />
    </Suspense>
  );
}

export function DungeonsOutlet() {
  return <DungeonsPage />;
}

export function BestiaryOutlet() {
  return (
    <Routes>
      <Route index element={<BestiaryPage />} />
      <Route path=":enemyId" element={<BestiaryEntryPage />} />
    </Routes>
  );
}

export function BoostersOutlet() {
  return <BoostersPage />;
}

export function CouponsOutlet() {
  return <CouponPage />;
}

export function CharacterOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return (
    <CharacterPage onPreviewProfile={(userId: string) => ctx.navigateToUserPreview(userId)} />
  );
}

export function NotificationsOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return (
    <NotificationsPage
      onViewShip={(shipId: string) => ctx.navigateToShipPreview(shipId)}
      onNavigateToShip={(shipId: string) => ctx.navigateToShipPreview(shipId)}
      onNotificationsRead={ctx.checkUnreadNotifications}
    />
  );
}

export function StatekOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  const navigate = useNavigate();
  return (
    <Suspense fallback={<ShipRouteSkeleton />}>
      <ShipPage
        onViewProfile={(userId: string) => ctx.navigateToUserPreview(userId)}
        onViewShip={(shipId: string) => ctx.navigateToShipPreview(shipId)}
        onNavigateToRanking={() => navigate('/game/ranking?tab=ships')}
      />
    </Suspense>
  );
}

export function RankingOutlet() {
  const ctx = useOutletContext<GameOutletContext>();
  return (
    <RankingPage
      onViewProfile={(userId: string) => ctx.navigateToUserPreview(userId)}
      onViewShip={(shipId: string) => ctx.navigateToShipPreview(shipId)}
    />
  );
}

export function UserPreviewOutlet() {
  const { userId } = useParams<{ userId: string }>();
  const ctx = useOutletContext<GameOutletContext>();
  if (!userId) return null;
  return (
    <UserPreviewPage
      userId={userId}
      onBack={ctx.goBackToMenu}
      onViewShip={(shipId: string) => ctx.navigateToShipPreview(shipId)}
    />
  );
}

export function CoinFlipOutlet() {
  return <CoinFlipPage />;
}

export function PremiumShopOutlet() {
  return <PremiumShopPage />;
}

export function SettingsOutlet() {
  return <SettingsPage />;
}

export function TitlesOutlet() {
  return <TitlesPage />;
}

export function ShipPreviewOutlet() {
  const { shipId } = useParams<{ shipId: string }>();
  const ctx = useOutletContext<GameOutletContext>();
  const navigate = useNavigate();
  if (!shipId) return null;
  return (
    <ShipPreviewPage
      shipId={shipId}
      onBack={ctx.goBackToMenu}
      onViewProfile={(userId: string) => ctx.navigateToUserPreview(userId)}
      onNavigateToShip={() => navigate('/game/statek')}
      onJoinRequestCancelled={ctx.checkUnreadNotifications}
    />
  );
}
