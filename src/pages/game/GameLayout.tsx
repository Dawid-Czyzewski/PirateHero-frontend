import { Suspense, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Coins, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { ShopOptimisticCurrencyProvider, useShopOptimisticCurrency } from '@/features/game/store/shop/shopOptimisticCurrencyContext';
import { SessionShopBoostersProvider } from '@/features/game/boosters/SessionShopBoostersContext';
import type { GameOutletContext } from './GameOutletContext';
import GameLoadingScreen from './GameLoadingScreen';
import GameProfileErrorScreen from './GameProfileErrorScreen';
import { GameActivityOutlet } from './GameActivityOutlet';
import GameLayoutSidebar, { GameLayoutMenuButton } from './GameLayoutSidebar';
import { useGameLayoutNotifications } from './useGameLayoutNotifications';
import { useGameLoadProgress } from './useGameLoadProgress';
import { GameHeaderUserPanel } from '@/pages/game/GameHeaderUserPanel';
import { useDailyReward } from '@/features/game/dailyRewards/useDailyReward';
import { DailyRewardModal } from '@/features/game/dailyRewards/DailyRewardModal';
import LevelUpModal from '@/components/modal/LevelUpModal';

function GameLayoutCurrencyReadout() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { goldOffset } = useShopOptimisticCurrency();
  const gold = Number(user?.gold ?? 0) + goldOffset;
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/8 px-2 py-1.5 sm:px-3 sm:py-2">
      <Coins className="h-4 w-4 text-primary" />
      <span className="hidden text-[11px] font-semibold text-primary/80 xl:inline">{t('gold')}</span>
      <span className="text-xs font-bold text-primary">{gold.toLocaleString()}</span>
    </div>
  );
}

function GameLayoutDiamondReadout() {
  const { t } = useTranslation();
  const { user } = useUser();
  const diamonds = Number(user?.diamonds ?? 0);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/15 bg-blue-500/8 px-2 py-1.5 sm:px-3 sm:py-2">
      <Gem className="h-4 w-4 text-blue-400" />
      <span className="hidden text-[11px] font-semibold text-blue-200/80 xl:inline">{t('diamonds')}</span>
      <span className="text-xs font-bold text-blue-300">{diamonds.toLocaleString()}</span>
    </div>
  );
}

export default function GameLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const storedUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const { user, isError, fetchUserData, progress, isReady } = useGameLoadProgress(storedUserId);
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unclaimedRewardsCount, dailyChallengesUnclaimedCount, weeklyContractUnclaimedCount, unreadNotificationsCount, checkUnclaimedRewards, checkUnreadNotifications } =
    useGameLayoutNotifications(user);
  const dailyReward = useDailyReward(Boolean(user));

  const outletContext = useMemo<GameOutletContext>(
    () => ({
      onQuestsUpdated: checkUnclaimedRewards,
      onRewardClaimed: checkUnclaimedRewards,
      checkUnreadNotifications,
      navigateToUserPreview: (userId: string) => navigate(`/game/user/${userId}`),
      navigateToShipPreview: (shipId: string) => navigate(`/game/ship/${shipId}`),
      goBackToMenu: () => navigate('/game/character'),
    }),
    [navigate, checkUnclaimedRewards, checkUnreadNotifications]
  );

  if (!isReady) {
    return <GameLoadingScreen progress={progress} />;
  }

  if (isError || user == null) {
    return <GameProfileErrorScreen onRetry={() => void fetchUserData()} />;
  }

  return (
    <ShopOptimisticCurrencyProvider>
      <SessionShopBoostersProvider>
        <div className="min-h-screen w-full bg-[hsl(220,25%,9%)] text-white">
          <div className="flex min-h-screen w-full">
            <GameLayoutSidebar
              isMobileMenuOpen={isMobileMenuOpen}
              onToggleMobileMenu={() => setIsMobileMenuOpen((o) => !o)}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              onLogout={logout}
              currentActivity={user.currentActivity}
              unclaimedRewardsCount={unclaimedRewardsCount}
              dailyChallengesUnclaimedCount={dailyChallengesUnclaimedCount}
              weeklyContractUnclaimedCount={weeklyContractUnclaimedCount}
              unreadNotificationsCount={unreadNotificationsCount}
            />

            <div className="flex min-h-screen flex-1 flex-col">
              <header className="flex h-14 min-h-14 flex-nowrap items-center gap-x-2 border-b border-border/30 bg-gradient-to-r from-[hsl(220,25%,7%)] to-[hsl(220,20%,9%)] px-3 sm:gap-x-3 sm:px-4">
                <GameLayoutMenuButton
                  isOpen={isMobileMenuOpen}
                  onToggle={() => setIsMobileMenuOpen((o) => !o)}
                  label={t('menu')}
                />
                <GameHeaderUserPanel user={user} />

                <div className="ml-auto flex shrink-0 items-center justify-end gap-1 sm:gap-2">
                  <GameLayoutCurrencyReadout />
                  <GameLayoutDiamondReadout />
                </div>
              </header>

              <main className="min-h-0 flex-1 overflow-auto p-3 md:p-4 lg:p-5 xl:p-6">
                <Suspense fallback={null}>
                  <GameActivityOutlet context={outletContext} currentActivity={user.currentActivity} />
                </Suspense>
              </main>
            </div>
          </div>
        </div>
        <Toaster richColors position="top-center" closeButton />
        {dailyReward.status?.canClaim && dailyReward.isModalOpen ? (
          <DailyRewardModal
            status={dailyReward.status}
            claimError={dailyReward.claimError}
            onClose={dailyReward.closeModal}
            onClaim={dailyReward.handleClaim}
            claimDisabled={dailyReward.isClaiming}
          />
        ) : null}
        <LevelUpModal
          isOpen={dailyReward.isLevelUpOpen}
          onClose={dailyReward.closeLevelUp}
          onDistributePoints={() => {
            dailyReward.closeLevelUp();
            void fetchUserData();
            navigate('/game/character');
          }}
          newLevel={dailyReward.levelUpLevel}
        />
      </SessionShopBoostersProvider>
    </ShopOptimisticCurrencyProvider>
  );
}
