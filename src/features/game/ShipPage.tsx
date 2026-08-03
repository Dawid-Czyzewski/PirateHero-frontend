import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useUser } from '@/hooks/useUser';
import type { StatekPageProps } from '@/features/game/gamePageTypes';
import NoShipView from '@/features/game/ship/NoShipView';
import ShipView, { buildShipTabs } from '@/features/game/ship/ShipView';
import type { ShipTab } from '@/features/game/ship/shipTypes';
import { useShip } from '@/features/game/ship/useShip';
import { ShipBattleArenaModal } from '@/features/game/ship/ShipBattleArenaModal';
import { useShipBattles } from '@/features/game/ship/useShipBattles';

export default function ShipPage({
  onViewProfile,
  onViewShip,
  onNavigateToRanking,
}: StatekPageProps) {
  const { t } = useTranslation();
  const { user, fetchUserData, updateUser } = useUser();
  const navigate = useNavigate();
  usePageMeta({
    title: t('shipPage.seoTitle'),
    description: t('shipPage.seoDescription'),
    openGraph: true,
  });

  const [tab, setTab] = useState<ShipTab>('crew');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    ship,
    loading,
    actionLoading,
    hasShip,
    chatMessages,
    contributeGold,
    setContributeGold,
    contributeDiamonds,
    setContributeDiamonds,
    feedback,
    clearFeedback,
    createShip,
    upgradeShip,
    handleContribute,
    changeRole,
    removeMember,
    deleteShip,
    leaveShip,
    sendChatMessage,
    loadChatHistoryIfNeeded,
    chatHistoryLoading,
    handleInternalNotesChange,
    handleDescriptionSave,
    handleToggleRequiresInvitation,
  } = useShip(user ?? null, fetchUserData, t, updateUser, tab === 'chat');

  const isCaptain =
    ship?.members?.find((m) => m.userId === ship?.currentUserId)?.role === 'OWNER';
  const shipMembershipReady = Boolean(hasShip && ship);
  const battles = useShipBattles(Boolean(isCaptain), shipMembershipReady);
  const { clearFightFeedback, refreshBattles } = battles;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (tab === 'battles') {
      clearFightFeedback();
      void refreshBattles();
    }
  }, [tab, clearFightFeedback, refreshBattles]);

  useEffect(() => {
    if (tab === 'chat' && hasShip) {
      void loadChatHistoryIfNeeded();
    }
  }, [tab, hasShip, loadChatHistoryIfNeeded]);

  useEffect(() => {
    if (feedback?.type === 'success') {
      const id = window.setTimeout(() => clearFeedback(), 4000);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [feedback, clearFeedback]);

  const handleCreateShip = useCallback(async () => {
    const ok = await createShip(newName, newDesc);
    if (ok) {
      setNewName('');
      setNewDesc('');
    }
  }, [createShip, newName, newDesc]);

  const sendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    sendChatMessage(text);
  }, [chatInput, sendChatMessage]);

  if (!user?.id) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {String(t('shipPage.loginRequired'))}
      </div>
    );
  }

  if (loading && !hasShip) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-muted-foreground">
        {String(t('shipPage.shipLoading'))}
      </div>
    );
  }

  if (!hasShip || !ship) {
    return (
      <NoShipView
        newName={newName}
        newDesc={newDesc}
        onNameChange={setNewName}
        onDescChange={setNewDesc}
        onCreateShip={handleCreateShip}
        onNavigateToRanking={onNavigateToRanking ?? (() => undefined)}
        errorMessage={feedback?.type === 'error' ? feedback.message : null}
        successMessage={feedback?.type === 'success' ? feedback.message : null}
        actionLoading={actionLoading}
      />
    );
  }

  const handleViewMember = (userId: string) => {
    if (userId === ship.currentUserId) {
      navigate('/game/character');
      return;
    }
    (onViewProfile ?? (() => undefined))(userId);
  };

  const canChangeMemberRoles =
    ship.members.find((m) => m.userId === ship.currentUserId)?.role === 'OWNER';

  const chatBootstrapping = tab === 'chat' && chatHistoryLoading;

  const battlesBundle = {
    opponents: battles.opponents,
    fightHistory: battles.fightHistory,
    loading: battles.loading,
    historyLoading: battles.historyLoading,
    error: battles.error,
    canStartFight: battles.canStartFight,
    checkingCanStart: battles.checkingCanStart,
    attackingOpponentId: battles.attackingOpponentId,
    fightFeedback: battles.fightFeedback,
    isCaptain: Boolean(isCaptain),
    onStartFight: battles.startFight,
    onViewFight: battles.viewFight,
    onViewShip: onViewShip ?? (() => undefined),
  };

  return (
    <div className="w-full space-y-3">
      {feedback?.type === 'error' ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {feedback.message}
        </div>
      ) : null}
      <ShipView
      ship={ship}
      canChangeMemberRoles={Boolean(canChangeMemberRoles)}
      tab={tab}
      tabs={buildShipTabs(t)}
      setTab={setTab}
      contributeGold={contributeGold}
      setContributeGold={setContributeGold}
      contributeDiamonds={contributeDiamonds}
      setContributeDiamonds={setContributeDiamonds}
      handleContribute={handleContribute}
      changeRole={changeRole}
      removeMember={removeMember}
      onToggleRequiresInvitation={handleToggleRequiresInvitation}
      invitationSettingLoading={actionLoading}
      upgradeShip={upgradeShip}
      battles={battlesBundle}
      chatMessages={chatMessages}
      chatEndRef={chatEndRef}
      chatInput={chatInput}
      setChatInput={setChatInput}
      sendChat={sendChat}
      chatBootstrapping={chatBootstrapping}
      onViewProfile={handleViewMember}
      onViewShip={onViewShip ?? (() => undefined)}
      onDeleteShip={deleteShip}
      onLeaveShip={leaveShip}
      onInternalNotesChange={handleInternalNotesChange}
      onDescriptionSave={handleDescriptionSave}
    />
      {battles.arenaReplay ? (
        <ShipBattleArenaModal
          open
          data={battles.arenaReplay}
          isReplay={battles.arenaReplayIsHistory}
          viewerShipId={String(ship.shipId)}
          playerUsername={String(user?.username ?? '')}
          playerLevel={Math.max(1, parseInt(String(user?.level?.name ?? '1'), 10) || 1)}
          playerAvatarId={String(user?.avatarName ?? 'captain')}
          t={t}
          onRequestClose={battles.clearArenaReplay}
        />
      ) : null}
    </div>
  );
}
