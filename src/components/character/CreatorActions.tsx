import type { ReactNode } from "react";

type CreatorActionsProps = {
  onRandomize: () => void;
};

const SLANT =
  "min-h-14 -skew-x-12 border-2 px-4 font-display text-[clamp(1.35rem,6vw,1.9rem)] tracking-wider text-white transition lg:text-3xl";

export function CreatorActions({ onRandomize }: CreatorActionsProps) {
  return (
    <div className="mt-auto grid grid-cols-[2fr_3fr] gap-3.5 px-1.5 lg:mt-2 lg:grid-cols-[15rem_19rem] lg:justify-center lg:gap-6">
      <button type="button" className={`${SLANT} border-white/55 bg-black/45 hover:bg-white/10`} onClick={onRandomize}>
        <SlantLabel>
          <DiceIcon />
          Losuj
        </SlantLabel>
      </button>
      <button
        type="button"
        className={`${SLANT} border-transparent bg-blood disabled:cursor-not-allowed disabled:brightness-75 disabled:grayscale-[0.35]`}
        disabled
        aria-describedby="create-soon"
      >
        <SlantLabel>Stwórz postać</SlantLabel>
      </button>
      <p className="sr-only" id="create-soon">
        Zapis postaci włączymy wkrótce.
      </p>
    </div>
  );
}

function SlantLabel({ children }: { children: ReactNode }) {
  return <span className="inline-flex skew-x-12 items-center gap-2.5">{children}</span>;
}

function DiceIcon() {
  return (
    <svg className="size-[1.4em]" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
