import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { GameSidebarItem } from './gameSidebarTypes';

type GameSidebarNavProps = {
  items: GameSidebarItem[];
  onCloseMobileMenu: () => void;
  collapsed?: boolean;
};

export function GameSidebarNav({ items, onCloseMobileMenu, collapsed = false }: GameSidebarNavProps) {
  const { t } = useTranslation();

  const itemLayout = collapsed
    ? 'justify-center gap-0 px-2 py-2.5'
    : 'gap-3 px-3 py-2.5';

  return (
    <nav className="mt-3 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-1" aria-label={t('menu')}>
      {items.map((item) => {
        const disabledReason = item.disabled && item.disabledReasonKey ? t(item.disabledReasonKey) : '';
        const titleAttr = collapsed ? item.title : undefined;

        if (item.disabled) {
          return (
            <div
              key={item.key}
              className={`relative flex cursor-not-allowed items-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/40 ${itemLayout}`}
              role="link"
              aria-disabled="true"
              aria-label={`${item.title}. ${disabledReason}`}
              title={titleAttr}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
                {item.notify > 0 ? (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500/50 ring-2 ring-[hsl(220,30%,10%)]">
                    <span className="sr-only">{item.notify}</span>
                  </span>
                ) : null}
              </div>
              <span
                className={`whitespace-nowrap text-xs font-medium tracking-wider uppercase ${
                  collapsed ? 'sr-only' : ''
                }`}
              >
                {item.title}
              </span>
            </div>
          );
        }

        return (
          <NavLink
            key={item.key}
            to={item.url}
            end
            onClick={onCloseMobileMenu}
            title={titleAttr}
            className={({ isActive }) => {
              const base = `relative flex items-center rounded-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 ${itemLayout}`;
              const active = isActive
                ? 'border border-primary/30 bg-gradient-to-r from-primary/15 to-transparent text-primary shadow-[0_0_12px_hsla(42,90%,50%,0.08)]'
                : 'border border-transparent text-primary hover:bg-muted/10 hover:text-primary';
              return `${base} ${active}`;
            }}
          >
            <div className="relative">
              <item.icon className="h-5 w-5 shrink-0" aria-hidden />
              {item.notify > 0 ? (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[hsl(220,30%,10%)]">
                  <span className="sr-only">{item.notify}</span>
                </span>
              ) : null}
            </div>
            <span
              className={`whitespace-nowrap text-xs font-medium tracking-wider uppercase ${
                collapsed ? 'sr-only' : ''
              }`}
            >
              {item.title}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
