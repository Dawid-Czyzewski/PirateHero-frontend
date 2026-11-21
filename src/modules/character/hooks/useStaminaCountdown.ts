"use client";

import { useEffect, useState } from "react";
import type { Stamina } from "@/modules/character/characterSheet";

const TICK_MS = 1000;

type Countdown = { stamina: Stamina; left: number | null };

function secondsLeft(countdown: Countdown, stamina: Stamina): number | null {
  if (countdown.stamina === stamina) return countdown.left;
  const restarted = countdown.stamina.nextPointInSeconds !== stamina.nextPointInSeconds || countdown.left === 0;
  return restarted ? stamina.nextPointInSeconds : countdown.left;
}

export function useStaminaCountdown(stamina: Stamina, onElapsed: () => void): Stamina {
  const [countdown, setCountdown] = useState<Countdown>({ stamina, left: stamina.nextPointInSeconds });
  const left = secondsLeft(countdown, stamina);
  const running = left !== null && left > 0;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setCountdown((previous) => {
        const current = secondsLeft(previous, stamina);
        return { stamina, left: current === null ? null : Math.max(0, current - 1) };
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [stamina, running]);

  useEffect(() => {
    if (left === 0) onElapsed();
  }, [left, onElapsed]);

  return { ...stamina, nextPointInSeconds: left };
}
