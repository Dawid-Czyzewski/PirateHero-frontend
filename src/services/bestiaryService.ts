import { requestJson } from '@/lib/api/requestJson';

export type BestiaryApiEntry = {
  enemyId: string;
  dungeonId: string;
  stage: number;
  discovered: boolean;
  defeatedAt: string | null;
  nameKey: string;
  loreKey: string;
};

export type BestiaryPayload = {
  entries: BestiaryApiEntry[];
};

export async function fetchBestiary(): Promise<BestiaryPayload> {
  return requestJson<BestiaryPayload>('/users/bestiary/entries', { method: 'GET' });
}
