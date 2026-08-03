import type { TFunction } from 'i18next';
import type { UserContextValue } from '@/context/userContext';
import type { GameUser } from '@/types/gameUser';
import { useShipData } from '@/features/game/ship/hooks/useShipData';
import { useShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';
import { useShipActions } from '@/features/game/ship/hooks/useShipActions';

export type { ShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';

export function useShip(
  user: GameUser | null | undefined,
  fetchUserData: UserContextValue['fetchUserData'] | undefined,
  t: TFunction,
  patchUser?: UserContextValue['updateUser'],
  chatPollingActive = false
) {
  const data = useShipData(user, t, chatPollingActive);
  const { feedback, setFeedback, clearFeedback } = useShipFeedback();
  const actions = useShipActions(user, fetchUserData, t, data, setFeedback, patchUser);

  return {
    payload: data.payload,
    ship: data.ship,
    loading: data.loading,
    actionLoading: actions.actionLoading,
    hasShip: data.ship != null,
    chatMessages: data.chatMessages,
    chatHistoryLoading: data.chatHistoryLoading,
    contributeGold: actions.contributeGold,
    setContributeGold: actions.setContributeGold,
    contributeDiamonds: actions.contributeDiamonds,
    setContributeDiamonds: actions.setContributeDiamonds,
    feedback,
    clearFeedback,
    loadShipPack: data.loadShipPack,
    loadChatHistoryIfNeeded: data.loadChatHistoryIfNeeded,
    createShip: actions.createShip,
    upgradeShip: actions.upgradeShip,
    handleContribute: actions.handleContribute,
    changeRole: actions.changeRole,
    removeMember: actions.removeMemberByIdx,
    deleteShip: actions.deleteShip,
    leaveShip: actions.leaveShip,
    sendChatMessage: actions.sendChatMessage,
    handleInternalNotesChange: actions.handleInternalNotesChange,
    handleDescriptionSave: actions.handleDescriptionSave,
    handleToggleRequiresInvitation: actions.handleToggleRequiresInvitation,
  };
}
