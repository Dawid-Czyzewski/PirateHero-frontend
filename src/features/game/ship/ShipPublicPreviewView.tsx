import { useTranslation } from 'react-i18next';
import { ShipViewPublicHeader } from '@/features/game/ship/ShipViewPublicHeader';
import { ShipViewTabsStrip } from '@/features/game/ship/ShipViewTabsStrip';
import { ShipViewCrewTab } from '@/features/game/ship/ShipViewCrewTab';
import { ShipViewUpgradesTab } from '@/features/game/ship/ShipViewUpgradesTab';
import { ShipViewDescriptionTab } from '@/features/game/ship/ShipViewDescriptionTab';
import type { ReactNode } from 'react';
import type { ShipData, ShipTab, ShipTabItem } from '@/features/game/ship/shipTypes';

type Props = {
  ship: ShipData;
  tab: ShipTab;
  tabs: ShipTabItem[];
  setTab: (tab: ShipTab) => void;
  onViewProfile: (userId: string) => void;
  crewJoinActions?: ReactNode;
};

export function ShipPublicPreviewView({ ship, tab, tabs, setTab, onViewProfile, crewJoinActions }: Props) {
  const { t } = useTranslation();
  const noopAsync = async () => {};
  const viewer = ship.members.find((m) => m.userId === ship.currentUserId);

  return (
    <div className="w-full space-y-4">
      <ShipViewPublicHeader ship={ship} t={t} omitDescription />
      <ShipViewTabsStrip tab={tab} tabs={tabs} setTab={setTab} />
      <div className="min-h-[min(400px,calc(100svh-14rem))] rounded-lg border border-border bg-card p-4">
        {tab === 'crew' ? (
          <ShipViewCrewTab
            ship={ship}
            viewer={viewer}
            canChangeMemberRoles={false}
            changeRole={noopAsync}
            removeMember={noopAsync}
            onToggleRequiresInvitation={noopAsync}
            invitationSettingLoading={false}
            onViewProfile={onViewProfile}
            t={t}
            crewJoinActions={crewJoinActions}
            previewMode
          />
        ) : null}
        {tab === 'upgrades' ? (
          <ShipViewUpgradesTab
            ship={ship}
            isCaptain={false}
            upgradeShip={noopAsync}
            t={t}
            previewMode
          />
        ) : null}
        {tab === 'description' ? <ShipViewDescriptionTab ship={ship} t={t} /> : null}
      </div>
    </div>
  );
}
