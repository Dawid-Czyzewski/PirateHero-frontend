export type RegenPool = { current: number; max: number; nextPointInSeconds: number | null };

export const STAMINA_SECONDS_PER_POINT = 180;

export const FIGHT_POINT_SECONDS_PER_POINT = 900;

export function secondsUntil(pool: RegenPool, required: number, secondsPerPoint: number): number | null {
  const missing = required - pool.current;
  if (missing <= 0) return 0;
  if (pool.nextPointInSeconds === null) return null;
  return pool.nextPointInSeconds + (missing - 1) * secondsPerPoint;
}

export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function waitHint(pool: RegenPool, required: number, secondsPerPoint: number, prefix: string): string | null {
  const seconds = secondsUntil(pool, required, secondsPerPoint);
  if (seconds === null || seconds <= 0) return null;
  return `${prefix} ${formatCountdown(seconds)}`;
}
