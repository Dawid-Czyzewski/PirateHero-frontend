import type { GameUser } from '@/types/gameUser';

export type RewardUpdatedUserPayload = {
  gold?: number;
  diamonds?: number;
  experiencePoints?: number;
  level?: { name?: string | number; expToNextLevel?: number; id?: number };
  storage?: GameUser['storage'];
  freeSkillPointsAvailable?: number;
};

export function patchUserFromRewardResponse(
  updated: RewardUpdatedUserPayload | null | undefined
): Partial<GameUser> {
  if (!updated) {
    return {};
  }

  const patch: Partial<GameUser> = {};

  if (updated.gold !== undefined) {
    patch.gold = updated.gold;
  }
  if (updated.diamonds !== undefined) {
    patch.diamonds = updated.diamonds;
  }
  if (updated.experiencePoints !== undefined) {
    patch.experiencePoints = updated.experiencePoints;
  }
  if (updated.freeSkillPointsAvailable !== undefined) {
    patch.freeSkillPointsAvailable = updated.freeSkillPointsAvailable;
  }
  if (updated.level) {
    patch.level = {
      name: String(updated.level.name ?? '1'),
      expToNextLevel: Number(updated.level.expToNextLevel ?? 100),
    };
  }
  if (updated.storage) {
    patch.storage = updated.storage;
  }

  return patch;
}
