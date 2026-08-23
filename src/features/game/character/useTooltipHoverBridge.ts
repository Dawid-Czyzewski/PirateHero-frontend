import { useCallback, useRef, useState } from 'react';

export function useTooltipHoverBridge() {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onSlotEnter = useCallback(() => {
    clearTimer();
    setHovered(true);
  }, [clearTimer]);

  const onSlotLeave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setHovered(false), 180);
  }, [clearTimer]);

  const onTooltipEnter = useCallback(() => {
    clearTimer();
    setHovered(true);
  }, [clearTimer]);

  const onTooltipLeave = useCallback(() => {
    clearTimer();
    setHovered(false);
  }, [clearTimer]);

  return { hovered, onSlotEnter, onSlotLeave, onTooltipEnter, onTooltipLeave };
}
