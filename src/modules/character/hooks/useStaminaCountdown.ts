"use client";

import { useEffect, useState } from "react";
import type { Stamina } from "@/modules/character/characterSheet";

const TICK_MS = 1000;

type Countdown = { source: Stamina; left: number | null };

export function useStaminaCountdown(stamina: Stamina, onElapsed: () => void): Stamina {
  const [countdown, setCountdown] = useState<Countdown>({ source: stamina, left: stamina.nextPointInSeconds });
  const left = countdown.source === stamina ? countdown.left : stamina.nextPointInSeconds;

  const running = left !== null && left > 0;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setCountdown((previous) => {
        const current = previous.source === stamina ? previous.left : stamina.nextPointInSeconds;
        return { source: stamina, left: current === null ? null : Math.max(0, current - 1) };
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [stamina, running]);

  useEffect(() => {
    if (left === 0) onElapsed();
  }, [left, onElapsed]);

  return { ...stamina, nextPointInSeconds: left };
}
