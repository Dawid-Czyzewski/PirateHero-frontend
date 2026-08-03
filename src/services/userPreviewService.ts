import { requestJson } from '@/lib/api/requestJson';
import type { UserPreviewData } from '@/types/preview';

export const fetchUserPreview = async (
  userId: string | number
): Promise<UserPreviewData | null> => {
  try {
    return await requestJson<UserPreviewData>(`/users/${userId}/preview`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching user preview:', error);
    return null;
  }
};
