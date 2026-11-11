import type { ReactNode } from "react";

type CreatorActionsProps = {
  creating: boolean;
  onRandomize: () => void;
  onCreate: () => void;
};

const SLANT =
  "min-h-14 -skew-x-12 border-2 px-4 font-display text-[clamp(1.35rem,6vw,1.9rem)] tracking-wider text-white transition lg:text-3xl";

const SPINNER =
  "size-[0.7em] animate-spin rounded-full border-3 border-white/40 border-t-white motion-reduce:animate-[spin_2.4s_linear_infinite]";

export function CreatorActions({ creating, onRandomize, onCreate }: CreatorActionsProps) {
  return (
    <div className="mt-auto grid grid-cols-[2fr_3fr] gap-3.5 px-1.5 lg:mt-2 lg:grid-cols-[15rem_19rem] lg:justify-center lg:gap-6">
      <button
        type="button"
        className={`${SLANT} border-white/55 bg-black/45 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60`}
        onClick={onRandomize}
        disabled={creating}
      >
        <SlantLabel>
          <DiceIcon />
          Losuj
        </SlantLabel>
      </button>
      <button
        type="button"
        className={`${SLANT} border-transparent bg-blood hover:brightness-110 disabled:cursor-progress disabled:brightness-90`}
        onClick={onCreate}
        disabled={creating}
        aria-busy={creating}
      >
        <SlantLabel>
          {creating ? <span className={SPINNER} aria-hidden="true" /> : null}
          {creating ? "Tworzenie…" : "Stwórz postać"}
        </SlantLabel>
      </button>
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
