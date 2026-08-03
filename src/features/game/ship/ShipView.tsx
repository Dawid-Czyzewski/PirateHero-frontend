import { useTranslation } from 'react-i18next';
import { buildShipTabs } from '@/features/game/ship/buildShipTabs';
import type { ShipViewProps } from '@/features/game/ship/shipViewProps';
import { ShipViewBattlesTab } from '@/features/game/ship/ShipViewBattlesTab';
import { ShipViewChatTab } from '@/features/game/ship/ShipViewChatTab';
import { ShipViewCrewTab } from '@/features/game/ship/ShipViewCrewTab';
import { ShipViewHeader } from '@/features/game/ship/ShipViewHeader';
import { ShipViewNotesTab } from '@/features/game/ship/ShipViewNotesTab';
import { ShipViewTabsStrip } from '@/features/game/ship/ShipViewTabsStrip';
import { ShipViewUpgradesTab } from '@/features/game/ship/ShipViewUpgradesTab';

export { buildShipTabs };
export type { ShipViewProps };

export default function ShipView({
  ship,
  canChangeMemberRoles,
  tab,
  tabs,
  setTab,
  contributeGold,
  setContributeGold,
  contributeDiamonds,
  setContributeDiamonds,
  handleContribute,
  changeRole,
  removeMember,
  onToggleRequiresInvitation,
  invitationSettingLoading,
  upgradeShip,
  battles,
  chatMessages,
  chatEndRef,
  chatInput,
  setChatInput,
  sendChat,
  chatBootstrapping,
  onViewProfile,
  onViewShip,
  onDeleteShip,
  onLeaveShip,
  onInternalNotesChange,
  onDescriptionSave,
}: ShipViewProps) {
  const { t, i18n } = useTranslation();
  const viewer = ship.members.find((m) => m.userId === ship.currentUserId);
  const isCaptain = viewer?.role === 'OWNER';
  return (
    <div className="w-full space-y-4">
      <ShipViewHeader
        ship={ship}
        t={t}
        isCaptain={isCaptain}
        onDeleteShip={onDeleteShip}
        onLeaveShip={onLeaveShip}
        contributeGold={contributeGold}
        setContributeGold={setContributeGold}
        contributeDiamonds={contributeDiamonds}
        setContributeDiamonds={setContributeDiamonds}
        handleContribute={handleContribute}
      />
      <ShipViewTabsStrip tab={tab} tabs={tabs} setTab={setTab} />
      <div className="min-h-[min(400px,calc(100svh-14rem))] rounded-lg border border-border bg-card p-4">
        {tab === 'crew' ? (
          <ShipViewCrewTab
            ship={ship}
            viewer={viewer}
            canChangeMemberRoles={canChangeMemberRoles}
            changeRole={changeRole}
            removeMember={removeMember}
            onToggleRequiresInvitation={onToggleRequiresInvitation}
            invitationSettingLoading={invitationSettingLoading}
            onViewProfile={onViewProfile}
            t={t}
          />
        ) : null}
        {tab === 'upgrades' ? (
          <ShipViewUpgradesTab
            ship={ship}
            isCaptain={isCaptain}
            upgradeShip={upgradeShip}
            t={t}
          />
        ) : null}
        {tab === 'battles' ? <ShipViewBattlesTab t={t} i18n={i18n} battles={battles} /> : null}
        {tab === 'notes' ? (
          <ShipViewNotesTab
            ship={ship}
            isCaptain={isCaptain}
            onDescriptionSave={onDescriptionSave}
            onInternalNotesChange={onInternalNotesChange}
            t={t}
          />
        ) : null}
        {tab === 'chat' ? (
          <ShipViewChatTab
            chatMessages={chatMessages}
            chatEndRef={chatEndRef}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendChat={sendChat}
            chatBootstrapping={chatBootstrapping}
            t={t}
          />
        ) : null}
      </div>
    </div>
  );
}
