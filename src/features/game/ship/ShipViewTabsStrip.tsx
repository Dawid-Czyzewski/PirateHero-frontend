import type { ShipTab, ShipTabItem } from '@/features/game/ship/shipTypes';
import { useIsPhoneLayout } from '@/hooks/useIsPhoneLayout';

type Props = {
  tab: ShipTab;
  tabs: ShipTabItem[];
  setTab: (tab: ShipTab) => void;
};

function phoneTabLabel(id: ShipTab, label: string): string {
  if (id === 'notes') {
    const slash = label.indexOf('/');
    if (slash > 0) return label.slice(0, slash).trim();
  }
  return label;
}

export function ShipViewTabsStrip({ tab, tabs, setTab }: Props) {
  const isPhone = useIsPhoneLayout();

  return (
    <div
      role="tablist"
      className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-card p-1 sm:flex sm:grid-cols-none sm:flex-nowrap"
    >
      {tabs.map((tabItem) => {
        const active = tab === tabItem.id;
        const label = isPhone ? phoneTabLabel(tabItem.id, tabItem.label) : tabItem.label;
        const Icon = tabItem.icon;
        return (
          <button
            key={tabItem.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setTab(tabItem.id)}
            className={`inline-flex h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[11px] font-heading font-bold leading-none transition-colors sm:h-10 sm:flex-1 sm:gap-1.5 sm:px-3 sm:text-sm ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <Icon className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
