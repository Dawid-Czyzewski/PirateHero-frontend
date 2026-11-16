import { CharacterFigure } from "@/components/character/preview/CharacterFigure";
import type { Appearance, AppearancePart } from "@/modules/character/appearance";

type VariantTileProps = {
  part: AppearancePart;
  name: string;
  appearance: Appearance;
  checked: boolean;
  onSelect: () => void;
};

const THUMBNAIL_VIEW: Record<AppearancePart, string> = {
  face: "56 22 88 88",
  hair: "52 2 96 96",
  beard: "56 30 88 98",
  tattoo: "54 34 92 92",
  skin: "40 10 120 120",
};

export function VariantTile({ part, name, appearance, checked, onSelect }: VariantTileProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      tabIndex={checked ? 0 : -1}
      className="grid content-start gap-1 rounded-md border-2 border-white/15 bg-[#14141b] p-1 text-center transition hover:border-white/45 aria-checked:border-blood aria-checked:shadow-[0_0_14px_rgb(225_25_45/0.6)]"
      onClick={onSelect}
    >
      <span className="block aspect-square overflow-hidden rounded-sm bg-[radial-gradient(circle_at_50%_40%,#34343f,#101016_75%)]">
        <CharacterFigure appearance={appearance} viewBox={THUMBNAIL_VIEW[part]} className="size-full" />
      </span>
      <span className="block min-h-[2lh] font-cond text-[0.8rem] leading-tight font-bold tracking-[.02em] text-[#f3eadb] uppercase sm:text-sm">{name}</span>
    </button>
  );
}
