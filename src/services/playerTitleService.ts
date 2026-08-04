import { requestJson } from '@/lib/api/requestJson';
import type {
  EquipTitleResponse,
  PlayerTitlesResponse,
} from '@/types/playerTitle';

export async function fetchPlayerTitles(): Promise<PlayerTitlesResponse> {
  return requestJson<PlayerTitlesResponse>('/user_titles', { method: 'GET' });
}

export async function equipPlayerTitle(titleCode: string): Promise<EquipTitleResponse> {
  return requestJson<EquipTitleResponse>('/user_titles/equip', {
    method: 'POST',
    body: { titleCode },
  });
}

export async function unequipPlayerTitle(): Promise<EquipTitleResponse> {
  return requestJson<EquipTitleResponse>('/user_titles/unequip', {
    method: 'POST',
  });
}
