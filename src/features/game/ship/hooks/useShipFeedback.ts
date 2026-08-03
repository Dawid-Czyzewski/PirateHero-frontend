import { useCallback, useState } from 'react';

export type ShipFeedback = { type: 'error' | 'success'; message: string } | null;

export function useShipFeedback() {
  const [feedback, setFeedback] = useState<ShipFeedback>(null);
  const clearFeedback = useCallback(() => setFeedback(null), []);

  return { feedback, setFeedback, clearFeedback };
}
