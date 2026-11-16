import Image from "next/image";
import { CharacterFigure } from "@/components/character/preview/CharacterFigure";
import { previewLabel } from "@/components/character/preview/previewLabel";
import type { Appearance } from "@/modules/character/appearance";
import { SCENE_BACKGROUND_SRC } from "@/modules/character/layerAssets";

type CreatorStageProps = {
  nick: string;
  appearance: Appearance;
  rolls: number;
};

const ROLL = "origin-bottom animate-roll motion-reduce:animate-none";

const GLOW = [
  "pointer-events-none absolute top-[42%] left-1/2 z-1 aspect-square w-[min(115%,44rem)] rounded-full",
  "[transform:translate(-50%,-50%)] animate-aura-pulse motion-reduce:animate-none",
  "bg-[radial-gradient(closest-side,rgba(255,64,38,.5),rgba(205,26,14,.26)_45%,rgba(150,10,6,.08)_72%,rgba(150,10,6,0))]",
].join(" ");


const FIGHTER =
  "mx-auto h-full w-auto [filter:drop-shadow(0_0_10px_rgba(255,46,24,.55))_drop-shadow(0_0_32px_rgba(200,20,10,.35))_drop-shadow(0_14px_14px_rgba(0,0,0,.7))]";

const NICK_PLATE = [
  "absolute bottom-[3%] left-1/2 z-4 m-0 max-w-[90%] -translate-x-1/2 truncate",
  "border-[12px] border-solid [border-image:url(/assets/fl/frames/plate@2x.png)_40_fill_/_12px_stretch]",
  "px-4 font-cond text-[clamp(1.15rem,4.6vw,1.6rem)] leading-none font-bold tracking-[.06em] text-[#f3eadb] uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.6)]",
].join(" ");

export function CreatorStage({ nick, appearance, rolls }: CreatorStageProps) {
  return (
    <section className="fl-card relative isolate h-full min-h-0 overflow-hidden" aria-label="Scena zawodnika">
      <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#0b0606]">
        <Image
          src={SCENE_BACKGROUND_SRC}
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          className="object-cover object-[50%_60%]"
        />
        <span className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,rgba(7,4,4,0)_0%,rgba(7,4,4,.35)_65%,rgba(7,4,4,.85)_100%)]" aria-hidden="true" />
        <span className={GLOW} aria-hidden="true" />
        <span
          className="absolute bottom-[6%] left-1/2 z-2 h-[9%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,.85),rgba(0,0,0,.4)_60%,rgba(0,0,0,0))]"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-x-0 top-[3%] bottom-[7%] z-3 flex items-end justify-center">
        <div key={rolls} className={`h-full ${rolls > 0 ? ROLL : ""}`}>
          <CharacterFigure
            appearance={appearance}
            label={previewLabel(appearance)}
            animated
            preload
            sizes="(max-width: 900px) 80vw, 520px"
            className={FIGHTER}
          />
        </div>
      </div>

      <p className={NICK_PLATE}>{nick}</p>
    </section>
  );
}
