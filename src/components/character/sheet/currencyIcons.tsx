import type { ReactNode } from "react";
import type { CurrencyKey } from "@/modules/character/characterSheet";

const ICON = "size-7 shrink-0";

export const CURRENCY_ICONS: Record<CurrencyKey, ReactNode> = {
  cebuliony: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4c-1 3-7 6-7 11a7 7 0 0 0 14 0c0-5-6-8-7-11Z" fill="#c9a24a" stroke="#6b4a12" strokeWidth="1.2" />
      <path d="M12 4V1.5M12 8c-2 3-2 9 0 13M12 8c2 3 2 9 0 13" fill="none" stroke="#6b4a12" strokeWidth="1.2" />
    </svg>
  ),
  zloteZeby: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3c-3 0-4 3-3.5 6 .4 2.5 1.5 4 2 7 .4 2.6 1 5 2.2 5s1.5-3 2.3-5c.5-1.2 1.5-1.2 2 0 .8 2 1.1 5 2.3 5s1.8-2.4 2.2-5c.5-3 1.6-4.5 2-7C21 6 20 3 17 3c-2 0-3 1-5 1S9 3 7 3Z"
        fill="var(--color-gold)"
        stroke="var(--color-bronze)"
        strokeWidth="1.2"
      />
    </svg>
  ),
  kondycha: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 2 4 14h6.5L9 22l11-13h-7l.5-7Z" fill="var(--color-ok)" stroke="#2f6b2b" strokeWidth="1.2" />
    </svg>
  ),
  zasiegi: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="#6ec6ff">
        <rect x="3" y="15" width="3.5" height="6" rx="1" />
        <rect x="8.5" y="11" width="3.5" height="10" rx="1" />
        <rect x="14" y="7" width="3.5" height="14" rx="1" />
        <rect x="19.5" y="3" width="2.5" height="18" rx="1" />
      </g>
    </svg>
  ),
  medale: (
    <svg className={ICON} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 1h4l2 7H9L7 1Zm10 0h-4l-2 7h4l2-7Z" fill="var(--color-blood)" />
      <circle cx="12" cy="15" r="7" fill="var(--color-gold)" stroke="var(--color-bronze)" strokeWidth="1.4" />
      <path d="m12 11 1.2 2.5 2.7.3-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.3L12 11Z" fill="var(--color-bronze)" />
    </svg>
  ),
};
