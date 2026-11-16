import type { ReactNode } from "react";

type CreatorActionsProps = {
  creating: boolean;
  onRandomize: () => void;
  onCreate: () => void;
};

const SLANT =
  "min-h-14 -skew-x-12 border-2 px-2 font-cond text-[clamp(1rem,4.6vw,1.5rem)] font-bold tracking-[.04em] whitespace-nowrap text-white uppercase shadow-[4px_4px_0_#000] [text-shadow:0_2px_0_rgb(0_0_0/0.45)] transition duration-150 ease-out lg:text-[1.3rem] xl:text-[1.6rem] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white active:enabled:scale-[0.97]";

const RANDOM_BTN = `${SLANT} border-blood/80 bg-black/70 hover:enabled:bg-blood/15 disabled:cursor-not-allowed disabled:opacity-60`;

const CREATE_BTN = `${SLANT} border-transparent bg-blood hover:enabled:brightness-110 disabled:cursor-progress disabled:brightness-90`;

const SPINNER =
  "size-[0.7em] animate-spin rounded-full border-3 border-white/40 border-t-white motion-reduce:animate-[spin_2.4s_linear_infinite]";

export function CreatorActions({ creating, onRandomize, onCreate }: CreatorActionsProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-auto grid grid-cols-2 gap-3 bg-[linear-gradient(to_top,var(--color-arena)_70%,transparent)] px-5 pt-5 pb-4 lg:static lg:mx-0 lg:mt-1 lg:bg-none lg:px-1.5 lg:py-0">
      <button
        type="button"
        className={RANDOM_BTN}
        onClick={onRandomize}
        disabled={creating}
        aria-label="Losuj wygląd"
      >
        <SlantLabel>
          <DiceIcon />
          Losuj wygląd
        </SlantLabel>
      </button>
      <button
        type="button"
        className={CREATE_BTN}
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
