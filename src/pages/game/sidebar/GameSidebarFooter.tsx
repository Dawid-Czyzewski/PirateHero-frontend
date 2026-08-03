import { LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type GameSidebarFooterProps = {
  onCloseMobileMenu: () => void;
  onLogout: () => void;
  collapsed?: boolean;
};

export function GameSidebarFooter({
  onCloseMobileMenu,
  onLogout,
  collapsed = false,
}: GameSidebarFooterProps) {
  const { t } = useTranslation();
  const itemLayout = collapsed
    ? 'justify-center gap-0 px-2 py-2.5'
    : 'gap-3 px-3 py-2.5';

  return (
    <>
      <div className="mx-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      <div className="space-y-1 px-1 pb-2 pt-2">
        <Link
          to="/game/settings"
          onClick={onCloseMobileMenu}
          title={collapsed ? t('settings') : undefined}
          className={`flex w-full items-center rounded-lg border border-transparent bg-transparent text-primary/80 transition-all hover:bg-primary/10 hover:text-primary ${itemLayout}`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span
            className={`whitespace-nowrap text-xs tracking-wider uppercase ${
              collapsed ? 'sr-only' : ''
            }`}
          >
            {t('settings')}
          </span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? t('logout') : undefined}
          className={`flex w-full cursor-pointer items-center rounded-lg border border-transparent bg-transparent text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400 ${itemLayout}`}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span
            className={`whitespace-nowrap text-xs tracking-wider uppercase ${
              collapsed ? 'sr-only' : ''
            }`}
          >
            {t('logout')}
          </span>
        </button>
      </div>
    </>
  );
}
