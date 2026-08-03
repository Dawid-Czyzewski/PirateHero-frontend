import { requestJson } from '@/lib/api/requestJson';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { mapUserStoreFromApi } from '@/mappers/userStore';
import { persistUserHasStatek } from '@/features/game/ship/statekMembershipStorage';
import type { GameUser, GameUserLevel, SessionShopBoosterEntry } from '@/types/gameUser';
import type { UserProfileApiData } from '@/types/userProfileApi';
import type { CurrentActivityDto } from '@/types/currentActivity';

type OnUnauthorized = () => void;

function normalizeSessionShopBoosters(
  raw: UserProfileApiData['sessionShopBoosters'] | undefined
): SessionShopBoosterEntry[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [];
  }
  return raw
    .map((e) => {
      const expRaw =
        e != null && typeof e === 'object' && 'expiresAt' in e ? (e as { expiresAt?: unknown }).expiresAt : undefined;
      const expiresAtNum =
        typeof expRaw === 'number'
          ? expRaw
          : typeof expRaw === 'string' && expRaw.trim() !== ''
            ? Number(expRaw)
            : NaN;
      return {
        boosterId: e != null && typeof e === 'object' && typeof e.boosterId === 'string' ? e.boosterId : '',
        expiresAt: Number.isFinite(expiresAtNum) ? expiresAtNum : 0,
      };
    })
    .filter((e) => e.boosterId !== '' && e.expiresAt > 0);
}

function normalizeGameUserLevel(
  raw: UserProfileApiData['level']
): GameUserLevel {
  if (raw && typeof raw === 'object') {
    const name = 'name' in raw ? String((raw as GameUserLevel).name ?? '1') : '1';
    const expToNextLevel =
      'expToNextLevel' in raw
        ? Number((raw as GameUserLevel).expToNextLevel ?? 100)
        : 100;
    return { name, expToNextLevel };
  }
  return { name: '1', expToNextLevel: 100 };
}

export async function loadUserProfile(
  userId: string,
  onUnauthorized: OnUnauthorized
): Promise<GameUser | null> {
  try {
    let userData: UserProfileApiData;
    try {
      userData = await requestJson<UserProfileApiData>(`/users/${userId}`, {
        method: 'GET',
      });
    } catch (e) {
      if (e instanceof ApiHttpError && (e.status === 401 || e.status === 403)) {
        onUnauthorized();
        return null;
      }
      console.error(
        'loadUserProfile: failed to load user (check VITE_API_URL / API base path)',
        e
      );
      return null;
    }

    const shipBonuses = userData.shipBonuses ?? {
      skills: { level: 0, percent: 0, multiplier: 1 },
      missions: { level: 0, percent: 0, multiplier: 1 },
      work: { level: 0, percent: 0, multiplier: 1 },
    };

    if (typeof userData.hasShip === 'boolean') {
      persistUserHasStatek(userId, userData.hasShip);
    }

    const parsedUser = {
      id: userData.id != null ? String(userData.id) : '',
      username: userData.username ?? '',
      avatarName: userData.avatarName ?? userData.avatar_name ?? undefined,
      experiencePoints: Number(userData.experiencePoints ?? 0),
      trainingPoints: userData.trainingPoints,
      diamonds: Number(userData.diamonds ?? userData.diamonds ?? 0),
      gold: Number(userData.gold ?? 0),
      duelPoints: userData.duelPoints,
      famePoints: userData.famePoints,
      energyPoints: userData.energyPoints,
      level: normalizeGameUserLevel(userData.level),
      missions: userData.missions || [],
      works: userData.works || [],
      trainings: userData.trainings,
      currentActivity: userData.currentActivity ?? undefined,
      ship: userData.hasShip ? { hasShip: true } : undefined,
      userBaseStatistics: userData.userBaseStatistics,
      freeSkillPointsAvailable: userData.freeSkillPointsAvailable,
      userSkillPointsPrices: userData.userSkillPointsPrices,
      storage: userData.storage,
      userEquipment: userData.userEquipment,
      userCapacities: userData.userCapacities,
      userBoosters: userData.userBoosters || [],
      userAvailableBoosters: userData.userAvailableBoosters || [],
      userStore: undefined,
      gameShop: userData.gameShop,
      shipBonuses,
      sessionShopBoosters: normalizeSessionShopBoosters(userData.sessionShopBoosters),
      equippedTitle: userData.equippedTitle ?? null,
    } as GameUser;

    const ca = parsedUser.currentActivity as CurrentActivityDto | undefined;
    const uca = userData.currentActivity ?? undefined;
    if (ca?.mission && uca?.mission) {
      ca.mission = uca.mission;
    }
    if (ca?.work && uca?.work) {
      ca.work = uca.work;
    }

    try {
      const storeRaw = await requestJson<unknown>(`/user-store/by-user/${userId}`, {
        method: 'GET',
      });
      const mapped = mapUserStoreFromApi(storeRaw);
      if (mapped) {
        parsedUser.userStore = mapped;
      }
    } catch {
      
    }

    return parsedUser;
  } catch (e) {
    console.error('Unexpected error fetching user data:', e);
    return null;
  }
}
