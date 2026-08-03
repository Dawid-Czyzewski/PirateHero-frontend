import { requestJson } from '@/lib/api/requestJson';
import type {
  ShipMessageDto,
  ShipSearchUserDto,
  MyShipPayload,
} from '@/types/ship';

export async function getMyShip(): Promise<MyShipPayload | null> {
  try {
    return await requestJson<MyShipPayload>('/ships/my-ship', { method: 'GET' });
  } catch (err) {
    console.error('Get ship error', err);
    return null;
  }
}

export async function getMessages(): Promise<ShipMessageDto[] | null> {
  try {
    const data = await requestJson<{ messages?: ShipMessageDto[] }>(
      '/ships/messages',
      { method: 'GET' }
    );
    return data.messages ?? [];
  } catch (err) {
    console.error('Get messages error', err);
    return null;
  }
}

export async function searchUsers(username: string): Promise<ShipSearchUserDto[]> {
  try {
    const data = await requestJson<{ users?: ShipSearchUserDto[] }>(
      `/ships/search-users?username=${encodeURIComponent(username)}`,
      { method: 'GET' }
    );
    return data.users ?? [];
  } catch (err) {
    console.error('Search users error', err);
    return [];
  }
}
