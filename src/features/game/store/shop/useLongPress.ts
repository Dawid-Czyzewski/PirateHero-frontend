import { useCallback, useRef } from 'react';

const DEFAULT_MS = 450;
const MOVE_CANCEL_PX = 10;

type LongPressHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

export function useLongPress(
  onLongPress: () => void,
  enabled: boolean,
  durationMs = DEFAULT_MS
): LongPressHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      if (!touch) return;
      firedRef.current = false;
      startRef.current = { x: touch.clientX, y: touch.clientY };
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        timerRef.current = null;
        onLongPress();
      }, durationMs);
    },
    [durationMs, enabled, onLongPress]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !startRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const dx = Math.abs(touch.clientX - startRef.current.x);
      const dy = Math.abs(touch.clientY - startRef.current.y);
      if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
        clear();
      }
    },
    [clear, enabled]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      if (firedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      clear();
      firedRef.current = false;
    },
    [clear, enabled]
  );

  const onTouchCancel = useCallback(() => {
    clear();
    firedRef.current = false;
  }, [clear]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;
      e.preventDefault();
    },
    [enabled]
  );

  return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onContextMenu };
}
