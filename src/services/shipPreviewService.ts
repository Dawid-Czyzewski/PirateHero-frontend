import { requestJson } from '@/lib/api/requestJson';
import type { ShipPreviewData } from '@/types/preview';

export const fetchShipPreview = async (
  shipId: string | number
): Promise<ShipPreviewData | null> => {
  try {
    return await requestJson<ShipPreviewData>(`/ships/${shipId}/preview`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching ship preview:', error);
    return null;
  }
};
