import { CharacterFigure } from "@/components/character/preview/CharacterFigure";
import { previewLabel } from "@/components/character/preview/previewLabel";
import type { Appearance } from "@/modules/character/appearance";

type CreatorStageProps = {
  nick: string;
  appearance: Appearance;
  rolls: number;
};

const ROLL = "origin-bottom animate-roll motion-reduce:animate-none";

const OCTAGON = "75,6 225,6 285,22 285,38 225,54 75,54 15,38 15,22";
const INNER_OCTAGON = "105,15 195,15 238,25 238,35 195,45 105,45 62,35 62,25";

function OctagonPlatform() {
  return (
    <svg className="relative -mt-[11%] w-full" viewBox="0 0 300 80" aria-hidden="true">
      <polygon points={OCTAGON} transform="translate(0 16)" fill="#1d1d23" stroke="#0b0b0f" strokeWidth={3} />
      <polygon points={OCTAGON} fill="#4d4d57" stroke="#0b0b0f" strokeWidth={3} />
      <polygon points={INNER_OCTAGON} fill="none" stroke="#33333b" strokeWidth={3} />
      <ellipse cx={150} cy={30} rx={70} ry={14} fill="#e1192d" opacity={0.28} />
      <ellipse cx={150} cy={31} rx={42} ry={7} fill="#0b0b0f" opacity={0.55} />
    </svg>
  );
}

export function CreatorStage({ nick, appearance, rolls }: CreatorStageProps) {
  return (
    <section className="clip-torn bg-parchment p-2 lg:p-2.5" aria-label="Scena zawodnika">
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden [background:radial-gradient(ellipse_62%_58%_at_50%_42%,rgb(225_25_45/0.9),rgb(109_10_20/0.6)_55%,transparent_100%),#0b0b0f] px-4 pt-4 pb-4 lg:px-6 lg:pt-8 lg:pb-5">
        <span
          className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0_26px,rgb(0_0_0/0.18)_26px_27px)]"
          aria-hidden="true"
        />
        <div className="relative w-full max-w-[15rem] sm:max-w-[20rem] lg:max-w-[25rem]">
          <div className="relative z-10 mx-auto w-[64%] animate-idle motion-reduce:animate-none">
            <div key={rolls} className={rolls > 0 ? ROLL : undefined}>
              <CharacterFigure
                appearance={appearance}
                label={previewLabel(appearance)}
                animated
                className="h-auto w-full drop-shadow-[0_6px_10px_rgb(0_0_0/0.55)]"
              />
            </div>
          </div>
          <OctagonPlatform />
        </div>
        <p className="relative m-0 -mt-1 -skew-x-12 border-2 border-black bg-coal px-5 py-1 font-cond text-xl font-bold tracking-[.04em] text-[#f3eadb] uppercase shadow-[3px_3px_0_#000] lg:text-2xl">
          <span className="inline-block skew-x-12">{nick}</span>
        </p>
      </div>
    </section>
  );
}
