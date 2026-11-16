import { CharacterFigure } from "@/components/character/preview/CharacterFigure";
import { previewLabel } from "@/components/character/preview/previewLabel";
import type { Appearance } from "@/modules/character/appearance";

export function CharacterPreview({ appearance }: { appearance: Appearance }) {
  return (
    <figure className="relative m-0 grid justify-items-center pb-6">
      <CharacterFigure
        appearance={appearance}
        label={previewLabel(appearance)}
        className="relative z-10 h-auto w-[min(64vw,16rem)] drop-shadow-[0_0_18px_rgb(225_25_45/0.45)] lg:w-72"
      />
      <span
        className="clip-octagon absolute bottom-4 aspect-[4/1] w-[min(80vw,22rem)] bg-blood-deep bg-[radial-gradient(closest-side,rgb(225_25_45/0.75),rgb(225_25_45/0.12)_80%)] lg:w-96"
        aria-hidden="true"
      />
    </figure>
  );
}
