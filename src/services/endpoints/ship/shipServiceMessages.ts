import { tryRequestJson } from '@/lib/api/tryRequestJson';
import type { ShipMessageDto } from '@/types/ship';

export type SendShipMessageResult =
  | { success: true; message: ShipMessageDto | null }
  | { success: false; message: string };

export async function sendMessage(
  content: string,
  user: unknown,
  updateUser: unknown,
  setActionLoading: unknown
): Promise<SendShipMessageResult> {
  if (typeof setActionLoading === 'function') setActionLoading(true);
  try {
    const result = await tryRequestJson<{ shipMessage?: ShipMessageDto }>(
      '/ships/send-message',
      {
        method: 'POST',
        body: { content },
      }
    );
    if (result.ok === false) {
      return { success: false, message: result.message };
    }
    return { success: true, message: result.data.shipMessage ?? null };
  } finally {
    if (typeof setActionLoading === 'function') setActionLoading(false);
  }
}
