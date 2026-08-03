import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query/queryClient';
import { AuthProvider } from './context/AuthProvider';
import { UserProvider } from './context/UserProvider';
import RequireAuth from './components/RequireAuth';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import PlayPage from './pages/PlayPage';
import AuthPage from './pages/AuthPage';
import ActivateAccount from './pages/ActivateAccount';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactPage from './pages/ContactPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import HomePage from './pages/HomePage';
import { PlayRedirect } from '@/components/routing/PlayRedirect';
import AboutGamePage from './pages/AboutGamePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import GameLayout from './pages/game/GameLayout';
import WorksPage from '@/features/game/WorksPage';
import TrainingPage from '@/features/game/TrainingPage';
import {
  MissionsOutlet,
  QuestTasksOutlet,
  StoreOutlet,
  FightsOutlet,
  DungeonsOutlet,
  BestiaryOutlet,
  CharacterOutlet,
  NotificationsOutlet,
  StatekOutlet,
  RankingOutlet,
  UserPreviewOutlet,
  ShipPreviewOutlet,
  BoostersOutlet,
  CouponsOutlet,
  CoinFlipOutlet,
  PremiumShopOutlet,
  SettingsOutlet,
  TitlesOutlet,
} from './pages/game/gameRouteElements';

function ClubToShipPreviewRedirect() {
  const { shipId } = useParams();
  return <Navigate to={`/game/ship/${shipId ?? ''}`} replace />;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/auth';
  const isResetPasswordPage = pathname.startsWith('/auth/reset-password/');
  const isThemedPublicSurface =
    pathname === '/' ||
    isAuthPage ||
    isResetPasswordPage ||
    pathname === '/auth/registration-success' ||
    pathname === '/contact' ||
    pathname === '/terms' ||
    pathname === '/privacy';

  return (
    <AuthProvider>
      <UserProvider>
        <div className="min-h-screen flex flex-col bg-black text-yellow-400">
          <Header />
          <OfflineBanner />
          <ErrorBoundary>
            <main
              id="main-content"
              tabIndex={-1}
              className={
                isThemedPublicSurface
                  ? 'flex flex-1 min-h-0 flex-col overflow-y-auto bg-background text-foreground outline-none'
                  : 'min-h-0 flex-1 bg-gray-900 text-white outline-none'
              }
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/zagraj" element={<PlayRedirect />} />
                <Route path="/o-grze" element={<AboutGamePage />} />
                <Route
                  path="/auth"
                  element={
                    <RedirectIfAuthenticated redirectTo="/game/character">
                      <AuthPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="/auth/registration-success"
                  element={
                    <RedirectIfAuthenticated redirectTo="/game/character">
                      <RegistrationSuccessPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="/auth/reset-password/:resetToken"
                  element={
                    <RedirectIfAuthenticated redirectTo="/game/character">
                      <ResetPasswordPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="/game"
                  element={
                    <RequireAuth redirectTo="/auth">
                      <GameLayout />
                    </RequireAuth>
                  }
                >
                      <Route index element={<Navigate to="character" replace />} />
                      <Route path="missions" element={<MissionsOutlet />} />
                      <Route path="questTasks" element={<QuestTasksOutlet />} />
                      <Route path="works" element={<WorksPage />} />
                      <Route path="training" element={<TrainingPage />} />
                      <Route path="character" element={<CharacterOutlet />} />
                      <Route path="titles" element={<TitlesOutlet />} />
                      <Route path="store" element={<StoreOutlet />} />
                      <Route path="fights" element={<FightsOutlet />} />
                      <Route path="dungeons" element={<DungeonsOutlet />} />
                      <Route path="bestiary/*" element={<BestiaryOutlet />} />
                      <Route path="boosters" element={<BoostersOutlet />} />
                      <Route path="coupons" element={<CouponsOutlet />} />
                      <Route path="premium-shop" element={<PremiumShopOutlet />} />
                      <Route path="rzut-moneta" element={<CoinFlipOutlet />} />
                      <Route path="settings" element={<SettingsOutlet />} />
                      <Route path="notifications" element={<NotificationsOutlet />} />
                      <Route path="statek" element={<StatekOutlet />} />
                      <Route path="klub" element={<Navigate to="/game/statek" replace />} />
                      <Route path="ranking" element={<RankingOutlet />} />
                      <Route path="user/:userId" element={<UserPreviewOutlet />} />
                      <Route path="ship/:shipId" element={<ShipPreviewOutlet />} />
                      <Route path="club/:shipId" element={<ClubToShipPreviewRedirect />} />
                    </Route>
                    <Route
                      path="/activateAccount/:activateToken"
                      element={
                        <RedirectIfAuthenticated redirectTo="/game/character">
                          <ActivateAccount />
                        </RedirectIfAuthenticated>
                      }
                    />
                    <Route
                      path="/play"
                      element={
                        <RedirectIfAuthenticated redirectTo="/game/character">
                          <PlayPage />
                        </RedirectIfAuthenticated>
                      }
                    />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
              </Routes>
            </main>
          </ErrorBoundary>
          <Footer />
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
