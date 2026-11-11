import type { ReactNode } from "react";

const PERK = [
  "flex items-center justify-center text-left font-semi font-medium text-[#ece6de] [text-shadow:0_2px_4px_rgba(0,0,0,.8)]",
  "not-first:border-l not-first:border-gold/28",
  "phone:gap-10 phone:px-8 phone:text-[calc(18*var(--k))] phone:leading-21",
  "desk:gap-[clamp(8px,.8vw,calc(14*var(--k)))] desk:px-[clamp(12px,1.6vw,calc(30*var(--k)))] desk:py-4 desk:text-[clamp(15px,1.2vw,calc(20*var(--k)))] desk:leading-[1.2]",
  "desk:max-[1199px]:gap-[8px] desk:max-[1199px]:px-[clamp(8px,1vw,14px)] desk:max-[1199px]:text-[clamp(14px,1.35vw,16px)]",
  "desk:first:pl-0 desk:last:pr-0 desk:max-[1199px]:first:pl-0 desk:max-[1199px]:last:pr-0",
].join(" ");

const ICON = [
  "flex-none text-gold [filter:drop-shadow(0_0_6px_rgba(240,195,90,.35))]",
  "phone:h-40 phone:w-46",
  "desk:aspect-[52/44] desk:h-auto desk:w-[clamp(34px,3vw,calc(52*var(--k)))] desk:max-[1199px]:w-[clamp(28px,2.6vw,34px)]",
].join(" ");

type PerkItem = {
  id: string;
  viewBox: string;
  icon: ReactNode;
  label: ReactNode;
};

const PERKS: readonly PerkItem[] = [
  {
    id: "www",
    viewBox: "0 0 48 40",
    icon: (
      <>
        <rect x="2" y="3" width="44" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M2 12h44" stroke="currentColor" strokeWidth="3" />
        <circle cx="8" cy="7.6" r="1.8" fill="currentColor" />
        <circle cx="14" cy="7.6" r="1.8" fill="currentColor" />
        <circle cx="20" cy="7.6" r="1.8" fill="currentColor" />
        <path d="M10 20h18M10 26h28M10 31h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
      </>
    ),
    label: (
      <>
        Darmowa gra
        <br /> w przeglądarce
      </>
    ),
  },
  {
    id: "dev",
    viewBox: "0 0 56 40",
    icon: (
      <>
        <rect x="2" y="4" width="16" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M8 31h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M24 8h26a2 2 0 0 1 2 2v20H22V10a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M18 34h36l-2 3H20z" fill="currentColor" />
      </>
    ),
    label: (
      <>
        Telefon
        <br /> i komputer
      </>
    ),
  },
  {
    id: "star",
    viewBox: "0 0 40 40",
    icon: (
      <>
        <path
          d="M20 2.5l5.3 11.2 12.2 1.5-9 8.4 2.4 12.1L20 29.7 9.1 35.7l2.4-12.1-9-8.4 12.2-1.5z"
          fill="currentColor"
          stroke="#7a5418"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M20 7.5l3.6 7.7 8.3 1-6.1 5.7" fill="none" stroke="#fff3c4" strokeWidth="1.4" opacity=".7" />
      </>
    ),
    label: (
      <>
        Fikcyjne gwiazdy
        <br /> freak fightów
      </>
    ),
  },
];

export function Perks() {
  return (
    <ul
      className="grid animate-fade-up-3 items-center motion-reduce:animate-none phone:mt-26 phone:w-660 phone:grid-cols-3 desk:mt-40 desk:grid-cols-[repeat(3,auto)] desk:justify-center desk:max-[1199px]:max-w-full"
      aria-label="Najważniejsze cechy gry"
    >
      {PERKS.map((perk) => (
        <li key={perk.id} className={PERK}>
          <svg className={ICON} viewBox={perk.viewBox} aria-hidden="true">
            {perk.icon}
          </svg>
          <span className="desk:whitespace-nowrap">{perk.label}</span>
        </li>
      ))}
    </ul>
  );
}
