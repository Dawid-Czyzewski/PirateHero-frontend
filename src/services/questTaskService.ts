import { requestJson } from '@/lib/api/requestJson';
import type { UserQuestsResponse } from '@/types/userQuests';
import type { ClaimQuestRewardData } from '@/types/questClaim';

export const fetchUserQuests = () =>
  requestJson<UserQuestsResponse>('/user_quests', { method: 'GET' });

export const claimQuestReward = (questId: string | number) =>
  requestJson<ClaimQuestRewardData>(
    `/user_quests/${questId}/claim-reward`,
    { method: 'POST' }
  );
