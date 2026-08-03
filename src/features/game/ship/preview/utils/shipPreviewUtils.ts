export const ROLE_PRIORITY = {
  OWNER: 0,
  MANAGER: 1,
  MEMBER: 2
};

export const roleIcon = (role) => {
  switch (role) {
    case 'OWNER':
      return '👑';
    case 'MANAGER':
      return '🛡️';
    default:
      return '⭐';
  }
};

export const roleLabel = (role, t) => {
  switch (role) {
    case 'OWNER':
      return t('owner');
    case 'MANAGER':
      return t('manager');
    default:
      return t('member');
  }
};

export const sortMembers = (members) => {
  if (!members || members.length === 0) {
    return [];
  }

  return [...members].sort((a, b) => {
    const weightA = ROLE_PRIORITY[a.role] ?? 999;
    const weightB = ROLE_PRIORITY[b.role] ?? 999;

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    const levelA = parseInt(a.user?.levelId ?? 0, 10);
    const levelB = parseInt(b.user?.levelId ?? 0, 10);

    if (levelA !== levelB) {
      return levelB - levelA;
    }

    return (a.joinedAt ?? '').localeCompare(b.joinedAt ?? '');
  });
};

export const canJoinShip = (user, clubData) => {
  if (!user || !clubData) return false;
  if (user.ship) return false;
  if (clubData.requiresInvitation) return false;
  if (clubData.membersCount >= clubData.maxMembers) return false;
  return true;
};
