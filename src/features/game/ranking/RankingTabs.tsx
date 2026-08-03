import { Ship, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type RankingTabId = 'players' | 'stateki';

type RankingTabsProps = {
  activeTab: RankingTabId;
  onTabChange: (tab: RankingTabId) => void;
};

export default function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  const { t } = useTranslation();

  const tabs: { id: RankingTabId; label: string; icon: typeof Users }[] = [
    { id: 'players', label: String(t('players')), icon: Users },
    { id: 'stateki', label: String(t('stateki')), icon: Ship },
  ];

  return (
    <div className="flex gap-1 rounded-lg border border-border p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-heading font-bold transition-colors ${
              selected
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
