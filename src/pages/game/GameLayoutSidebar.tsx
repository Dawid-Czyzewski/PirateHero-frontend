import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import type { CurrentActivityDto } from '@/types/currentActivity';
import { buildGameSidebarItems } from './sidebar/buildGameSidebarItems';
import { GameSidebarNav } from './sidebar/GameSidebarNav';
import { GameSidebarFooter } from './sidebar/GameSidebarFooter';

type Props = {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
  currentActivity: CurrentActivityDto | undefined;
  unclaimedRewardsCount: number;
  unreadNotificationsCount: number;
};

export default function GameLayoutSidebar({
  isMobileMenuOpen,
  onCloseMobileMenu,
  onLogout,
  currentActivity,
  unclaimedRewardsCount,
  unreadNotificationsCount,
}: Props) {
  const { t } = useTranslation();
  const isInMission = !!currentActivity?.mission;
  const isInWork = !!currentActivity?.work;
  const isInTraining = !!currentActivity?.training;
  const [isLgUp, setIsLgUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      setIsLgUp(mq.matches);
      if (mq.matches) onCloseMobileMenu();
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [onCloseMobileMenu]);

  const mainItems = buildGameSidebarItems({
    t,
    isInMission,
    isInWork,
    isInTraining,
    unclaimedRewardsCount,
    unreadNotificationsCount,
  });

  const collapsed = isLgUp || !isMobileMenuOpen;

  return (
    <>
      {isMobileMenuOpen && !isLgUp ? (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onCloseMobileMenu}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`
            fixed lg:static
            top-0 left-0 bottom-0
            w-56 lg:w-16
            bg-gradient-to-b from-[hsl(220,30%,10%)] to-[hsl(220,25%,6%)] border-r border-border/40 p-2 flex-shrink-0 z-40
            transition-transform duration-300 ease-in-out
            flex flex-col overflow-hidden
            ${isMobileMenuOpen && !isLgUp ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
      >
        <div className="flex items-center justify-between gap-2 px-1 pt-1 lg:hidden">
          <span className="px-2 font-heading text-xs font-bold uppercase tracking-wider text-primary/80">
            {t('menu')}
          </span>
          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-primary/80 transition hover:bg-primary/10 hover:text-primary"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <GameSidebarNav
          items={mainItems}
          onCloseMobileMenu={onCloseMobileMenu}
          collapsed={collapsed}
        />
        <GameSidebarFooter onCloseMobileMenu={onCloseMobileMenu} onLogout={onLogout} collapsed={collapsed} />
      </aside>
    </>
  );
}

export function GameLayoutMenuButton({
  isOpen,
  onToggle,
  label,
}: {
  isOpen: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition hover:bg-primary/20"
      aria-expanded={isOpen}
      aria-label={label}
    >
      {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
    </button>
  );
}
