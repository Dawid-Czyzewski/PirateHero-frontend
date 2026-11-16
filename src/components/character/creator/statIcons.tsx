import type { ReactNode } from "react";
import type { StatKey } from "@/modules/character/characterSheet";

export type StatIconKey = StatKey | "hp";

const ICON = "size-6 shrink-0";
const EDGE = { stroke: "#0b0b0f", strokeWidth: 1.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const LINE = { ...EDGE, fill: "none" } as const;

export const STAT_ICONS: Record<StatIconKey, ReactNode> = {
  strength: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18c0-5 2-8 5-10l2-4 3 1-1 4c3 0 6 2 7 6-2 3-6 4-10 4-3 0-5-.5-6-1Z" fill="#e3b08a" {...EDGE} />
      <path d="M9 13c1.5-1 3.5-1 5 .5" {...LINE} />
    </svg>
  ),
  endurance: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21 4 13a5 5 0 0 1 8-6 5 5 0 0 1 8 6l-8 8Z" fill="var(--color-blood)" {...EDGE} />
      <path d="M6 12h3l1.5-3 2 5 1.5-2H18" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  technique: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 10V7.5a1.5 1.5 0 0 1 3 0V6a1.5 1.5 0 0 1 3 0v.5a1.5 1.5 0 0 1 3 0V8a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7H11a5 5 0 0 1-5-5v-5Z" fill="#e3b08a" {...EDGE} />
      <path d="M9 10v2M12 9v3M15 9v3" {...LINE} />
    </svg>
  ),
  charisma: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="3" width="8" height="11" rx="4" fill="#a6a3ad" {...EDGE} />
      <path d="M12 14v5M8 21h8" {...LINE} stroke="#a6a3ad" strokeWidth={2} />
      <path d="m19 4 .6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2L19 4Z" fill="var(--color-gold)" />
    </svg>
  ),
  hp: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c3 5 7 9 7 13a7 7 0 0 1-14 0c0-4 4-8 7-13Z" fill="var(--color-blood)" {...EDGE} />
      <path d="M9 15a3 3 0 0 0 3 3" fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
    </svg>
  ),
};
