import { CharacterFigure } from "@/components/character/preview/CharacterFigure";
import type { Appearance, AppearancePart } from "@/modules/character/appearance";

type VariantTileProps = {
  part: AppearancePart;
  name: string;
  appearance: Appearance;
  checked: boolean;
  onSelect: () => void;
};

const TILE = [
  "group fl-card grid min-w-0 content-start gap-1 p-0 text-center transition-[filter,transform] duration-150",
  "hover:brightness-115 active:translate-y-px",
  "aria-checked:[filter:drop-shadow(0_0_6px_rgba(240,195,90,.85))_drop-shadow(0_0_14px_rgba(225,25,45,.45))]",
].join(" ");

export function VariantTile({ part, name, appearance, checked, onSelect }: VariantTileProps) {
  return (
    <button type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1} className={TILE} onClick={onSelect}>
      <span className="relative block aspect-square overflow-hidden rounded-[3px] bg-[radial-gradient(circle_at_50%_38%,#5a1418,#1a0b0c_58%,#0b0606)] ring-0 ring-gold group-aria-checked:ring-2">
        <CharacterFigure
          appearance={appearance}
          focusPart={part}
          sizes="(max-width: 900px) 70vw, 360px"
          className="size-full"
        />
        <span
          className="absolute top-1 right-1 hidden size-5 place-items-center rounded-full bg-[linear-gradient(#ffd77a,#f0c35a_50%,#b8862f)] shadow-[0_1px_2px_#000] group-aria-checked:grid"
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="size-3.5">
            <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="#1d1206" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className="block min-h-[2lh] px-0.5 pb-0.5 font-cond text-[clamp(0.68rem,2.8vw,0.88rem)] leading-[1.05] [text-wrap:balance] [overflow-wrap:anywhere] font-bold tracking-[.02em] text-[#f3eadb] uppercase group-aria-checked:text-gold-light desk:text-[clamp(0.72rem,0.95vw,0.95rem)]">
        {name}
      </span>
    </button>
  );
}
