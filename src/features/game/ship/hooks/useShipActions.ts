import { useState } from 'react';
import type { TFunction } from 'i18next';
import type { UserContextValue } from '@/context/userContext';
import type { GameUser } from '@/types/gameUser';
import { useShipChatNotes } from '@/features/game/ship/hooks/useShipChatNotes';
import { useShipCreateDelete } from '@/features/game/ship/hooks/useShipCreateDelete';
import { useShipCrew } from '@/features/game/ship/hooks/useShipCrew';
import { useShipUpgrades } from '@/features/game/ship/hooks/useShipUpgrades';
import type { UseShipDataResult } from '@/features/game/ship/hooks/useShipData';
import type { ShipFeedback } from '@/features/game/ship/hooks/useShipFeedback';

export function useShipActions(
  user: GameUser | null | undefined,
  fetchUserData: UserContextValue['fetchUserData'] | undefined,
  t: TFunction,
  data: UseShipDataResult,
  setFeedback: (feedback: ShipFeedback) => void,
  patchUser?: UserContextValue['updateUser']
) {
  const [actionLoading, setActionLoading] = useState(false);

  const { createShip, deleteShip } = useShipCreateDelete({
    user,
    fetchUserData,
    t,
    data,
    setFeedback,
    setActionLoading,
  });

  const { contributeGold, setContributeGold, contributeDiamonds, setContributeDiamonds, upgradeShip, handleContribute } =
    useShipUpgrades({
      user,
      fetchUserData,
      t,
      data,
      setFeedback,
      patchUser,
    });

  const { changeRole, removeMemberByIdx, leaveShip } = useShipCrew({
    user,
    fetchUserData,
    t,
    data,
    setFeedback,
  });

  const { sendChatMessage, handleInternalNotesChange, handleToggleRequiresInvitation, handleDescriptionSave } =
    useShipChatNotes({
      user,
      fetchUserData,
      t,
      data,
      setFeedback,
      setActionLoading,
    });

  return {
    actionLoading,
    contributeGold,
    setContributeGold,
    contributeDiamonds,
    setContributeDiamonds,
    createShip,
    upgradeShip,
    handleContribute,
    changeRole,
    removeMemberByIdx,
    deleteShip,
    leaveShip,
    sendChatMessage,
    handleInternalNotesChange,
    handleToggleRequiresInvitation,
    handleDescriptionSave,
  };
}
