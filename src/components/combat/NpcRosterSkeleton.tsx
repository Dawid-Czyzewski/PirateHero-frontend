import { ROSTER_GRID } from "@/components/combat/rosterLayout";

const PLACEHOLDER_IDS = ["first", "second", "third", "fourth"] as const;

export function NpcRosterSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Wczytujemy przeciwników…</span>
      <ul className={ROSTER_GRID} aria-hidden="true">
        {PLACEHOLDER_IDS.map((id) => (
          <li key={id} className="fl-card h-44 animate-pulse bg-white/5 motion-reduce:animate-none" />
        ))}
      </ul>
    </div>
  );
}
