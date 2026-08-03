export function formatInvitationNotification(inv, myShipId, t, handleAcceptInvitation, handleDeclineInvitation) {
  const isAlreadyMember = myShipId !== null && inv.ship.id === myShipId;
  const status = inv.status || (inv.accepted === null ? 'pending' : (inv.accepted ? 'accepted' : 'declined'));
  const isActive = status === 'pending' && !isAlreadyMember;
  const joinedThroughOtherInvitation = isAlreadyMember && status === 'accepted';
  
  let statusMessage = '';
  if (joinedThroughOtherInvitation) {
    statusMessage = t('invitationJoinedThroughOther');
  } else if (status === 'accepted') {
    statusMessage = t('invitationAccepted');
  } else if (status === 'declined') {
    statusMessage = t('invitationDeclined');
  } else if (isAlreadyMember) {
    statusMessage = t('invitationAlreadyMember');
  }
  
  return {
    id: `invitation-${inv.id}`,
    invitationId: inv.id,
    title: t('statekInvitation'),
    content: t('statekInvitationContent', {
      inviter: inv.inviter.username,
      statekName: inv.ship.title,
    }) || `${inv.inviter.username} zaprosił Cię do załogi statku ${inv.ship.title}`,
    ship: inv.ship,
    inviter: inv.inviter,
    createdAt: inv.createdAt,
    isRead: inv.isRead || false,
    type: 'ship_invitation',
    status: status,
    isActive: isActive,
    statusMessage: statusMessage,
    isAlreadyMember: isAlreadyMember,
    actions: isActive ? [
      {
        label: t('accept'),
        primary: true,
        onClick: () => handleAcceptInvitation(inv.id, inv.ship.id),
        disabled: false
      },
      {
        label: t('decline'),
        primary: false,
        onClick: () => handleDeclineInvitation(inv.id),
        disabled: false
      }
    ] : []
  };
}

export function formatJoinRequestNotification(req, myShipId, myShipMemberIds, t, handleApproveJoinRequest, handleRejectJoinRequest) {
  const isAlreadyMember = myShipId !== null && myShipMemberIds.has(req.user.id);
  const status = req.status || (req.approved === null ? 'pending' : (req.approved ? 'approved' : 'rejected'));
  const isActive = status === 'pending' && !isAlreadyMember;
  
  let statusMessage = '';
  if (status === 'approved') {
    statusMessage = t('joinRequestApproved');
  } else if (status === 'rejected') {
    statusMessage = t('joinRequestRejected');
  } else if (isAlreadyMember) {
    statusMessage = t('joinRequestAlreadyMember');
  }
  
  return {
    id: `join-request-${req.id}`,
    requestId: req.id,
    title: t('joinRequest'),
    content: t('joinRequestContent', { 
      username: req.user.username 
    }) || `${req.user.username} chce dołączyć na Twój statek`,
    user: req.user,
    ship:
      myShipId != null
        ? { id: myShipId, title: String(t('notificationsPage.yourShip')) }
        : undefined,
    createdAt: req.createdAt,
    isRead: req.isRead || false,
    type: 'join_request',
    status: status,
    isActive: isActive,
    statusMessage: statusMessage,
    isAlreadyMember: isAlreadyMember,
    actions: isActive ? [
      {
        label: t('accept'),
        primary: true,
        onClick: () => handleApproveJoinRequest(req.id),
        disabled: false
      },
      {
        label: t('decline'),
        primary: false,
        onClick: () => handleRejectJoinRequest(req.id),
        disabled: false
      }
    ] : []
  };
}

export function formatRemovalNotification(notif, t) {
  return {
    id: `removal-${notif.id}`,
    notificationId: notif.id,
    title: t('removalNotification'),
    content: t('removalNotificationContent', {
      remover: notif.remover.username,
      statekName: notif.ship.title,
    }) || `${notif.remover.username} wyrzucił Cię ze statku ${notif.ship.title}`,
    ship: notif.ship,
    remover: notif.remover,
    createdAt: notif.createdAt,
    isRead: notif.isRead || false,
    type: 'removal_notification',
    actions: []
  };
}

export function formatFightNotification(notif, t) {
  const fightType = String(notif.fightType ?? '');
  const isAttacked = fightType.startsWith('attacked');
  const resultKey = fightType.endsWith('_win')
    ? 'statekFightNotification.resultWon'
    : fightType.endsWith('_loss')
      ? 'statekFightNotification.resultLost'
      : 'statekFightNotification.resultUnknown';
  const result = t(resultKey);

  const title = isAttacked
    ? t('statekFightNotification.attacked')
    : t('statekFightNotification.attacking');

  const attackerShip = notif.attackerShip?.title || 'Unknown';
  const defenderShip = notif.defenderShip?.title || 'Unknown';
  const fightInfo = t('statekFightNotification.viewFightInfo');

  const content = isAttacked
    ? (
        t('statekFightNotification.attackedContent', {
          attackerShip,
          result
        }) || `Statek ${attackerShip} zaatakował Twój statek. ${result}`
      )
    : (
        t('statekFightNotification.attackingContent', {
          defenderShip,
          result
        }) || `Twój kapitan zaatakował statek ${defenderShip}. ${result}`
      );

  return {
    id: `fight-${notif.id}`,
    notificationId: notif.id,
    title: title,
    content: `${content}\n\n${fightInfo}`,
    attackerShip: notif.attackerShip,
    defenderShip: notif.defenderShip,
    fightType: notif.fightType,
    createdAt: notif.createdAt,
    isRead: notif.isRead || false,
    type: 'ship_fight_notification',
    actions: []
  };
}
