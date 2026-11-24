"use client";

import { useEffect, useState } from "react";
import type { RegenPool } from "@/modules/character/regenPool";

const TICK_MS = 1000;

type Countdown = { pool: RegenPool; left: number | null };

function secondsLeft(countdown: Countdown, pool: RegenPool): number | null {
  if (countdown.pool === pool) return countdown.left;
  const restarted = countdown.pool.nextPointInSeconds !== pool.nextPointInSeconds || countdown.left === 0;
  return restarted ? pool.nextPointInSeconds : countdown.left;
}

export function usePoolCountdown(pool: RegenPool, onElapsed: () => void): RegenPool {
  const [countdown, setCountdown] = useState<Countdown>({ pool, left: pool.nextPointInSeconds });
  const left = secondsLeft(countdown, pool);
  const running = left !== null && left > 0;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setCountdown((previous) => {
        const current = secondsLeft(previous, pool);
        return { pool, left: current === null ? null : Math.max(0, current - 1) };
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [pool, running]);

  useEffect(() => {
    if (left === 0) onElapsed();
  }, [left, onElapsed]);

  return { ...pool, nextPointInSeconds: left };
}
