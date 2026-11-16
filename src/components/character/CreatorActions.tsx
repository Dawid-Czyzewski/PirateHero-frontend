import type { ReactNode } from "react";

type CreatorActionsProps = {
  creating: boolean;
  onRandomize: () => void;
  onCreate: () => void;
};

const BTN = [
  "fl-btn h-14 w-full min-w-0 tracking-[.02em] [--fs:30] desk:h-[3.6rem] desk:[--fs:26]",
  "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:filter-none",
].join(" ");

const SHINE = [
  "pointer-events-none absolute inset-[calc(-1*var(--bw)+5*var(--k))] overflow-hidden rounded-[8px] motion-reduce:hidden",
  "before:absolute before:inset-y-0 before:left-0 before:w-[45%] before:mix-blend-soft-light before:content-['']",
  "before:bg-[linear-gradient(105deg,rgba(255,255,255,0)_20%,rgba(255,250,225,.55)_50%,rgba(255,255,255,0)_80%)]",
  "before:[transform:translateX(-120%)] before:animate-shine before:will-change-transform motion-reduce:before:animate-none",
].join(" ");

const SPINNER =
  "size-[0.8em] animate-spin rounded-full border-3 border-[#1d1206]/30 border-t-[#1d1206] motion-reduce:animate-[spin_2.4s_linear_infinite]";

export function CreatorActions({ creating, onRandomize, onCreate }: CreatorActionsProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto grid w-full max-w-[40rem] grid-cols-2 gap-2.5 bg-[linear-gradient(to_top,#070404_70%,rgba(7,4,4,0))] px-4 pt-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] desk:static desk:z-auto desk:mx-0 desk:mt-auto desk:max-w-none desk:gap-3 desk:bg-none desk:p-0">
      <button
        type="button"
        className={`${BTN} fl-btn-dark`}
        onClick={onRandomize}
        disabled={creating}
        aria-label="Losuj wygląd"
      >
        <Label>
          <DiceIcon />
          Losuj wygląd
        </Label>
      </button>
      <button
        type="button"
        className={`${BTN} overflow-visible`}
        onClick={onCreate}
        disabled={creating}
        aria-busy={creating}
        aria-label={creating ? "Tworzenie…" : "Stwórz postać"}
      >
        <Label>
          <span className="relative inline-grid place-items-center">
            <span className={`col-start-1 row-start-1 ${creating ? "invisible" : ""}`}>Stwórz postać</span>
            <span className={`col-start-1 row-start-1 ${creating ? "" : "invisible"}`} aria-hidden="true">
              Tworzenie…
            </span>
            <span
              className={`absolute top-1/2 right-full mr-2 -translate-y-1/2 ${creating ? "" : "invisible"}`}
              aria-hidden="true"
            >
              <span className={SPINNER} />
            </span>
          </span>
        </Label>
        {creating ? null : <i className={SHINE} aria-hidden="true" />}
      </button>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="inline-flex min-w-0 items-center justify-center gap-2">{children}</span>;
}

function DiceIcon() {
  return (
    <svg className="size-[1.1em] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
