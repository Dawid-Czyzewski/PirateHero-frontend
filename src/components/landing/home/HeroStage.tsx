import Image from "next/image";
import { HIDDEN_ON_SMALL_DESKTOP } from "@/components/landing/home/HeroBackdrop";
import { DESK } from "@/components/site/ArtPicture";

const GLOW = [
  "absolute z-0 rounded-full [transform:translate(-50%,-50%)] animate-aura-pulse motion-reduce:animate-none motion-reduce:desk:opacity-90",
  "bg-[radial-gradient(closest-side,rgba(255,64,38,.5),rgba(205,26,14,.26)_45%,rgba(150,10,6,.08)_72%,rgba(150,10,6,0))]",
  "phone:top-[46%] phone:left-1/2 phone:h-600 phone:w-600 phone:opacity-80",
  "desk:top-1/2 desk:left-1/2 desk:aspect-square desk:w-[min(125%,calc(1000*var(--k)))]",
].join(" ");

const SLASH = [
  "absolute top-[44%] left-1/2 z-1 rounded-full motion-reduce:animate-none",
  "bg-[linear-gradient(90deg,rgba(255,60,40,0),rgba(255,60,40,.85)_10%,#ff5a44_30%,#fff1ea_50%,#ff5a44_70%,rgba(255,60,40,.85)_90%,rgba(255,60,40,0))]",
  "shadow-[0_0_6px_1px_rgba(255,96,64,.95),0_0_18px_4px_rgba(255,40,20,.75),0_0_54px_12px_rgba(224,30,20,.4)]",
  "phone:h-5 phone:w-860 desk:h-6 desk:w-[min(165%,calc(1300*var(--k)))]",
  HIDDEN_ON_SMALL_DESKTOP,
].join(" ");

const SHADOW = [
  "absolute -bottom-[4%] left-1/2 z-1 h-[16%] w-[86%] rounded-[50%] [transform:translateX(-50%)] phone:hidden",
  "bg-[radial-gradient(closest-side,rgba(0,0,0,.85),rgba(0,0,0,.4)_60%,rgba(0,0,0,0))]",
].join(" ");

const FIGURE = [
  "z-2",
  "phone:absolute phone:inset-x-0 phone:bottom-0 phone:flex phone:justify-center phone:[mask-image:linear-gradient(#000_80%,transparent_100%)]",
  "desk:absolute desk:inset-0 desk:-bottom-64 desk:flex desk:items-end desk:justify-center desk:[mask-image:linear-gradient(#000_92%,transparent_100%)]",
].join(" ");

const FIGURE_INNER =
  "relative phone:w-500 desk:aspect-[1164/1398] desk:h-[min(calc(100%-10*var(--k)),calc(100cqw*1.3))] desk:flex-none";

const FIGHTER = [
  "relative z-1 block [&_img]:block [&_img]:h-auto [&_img]:w-full",
  "[&_img]:[filter:drop-shadow(0_0_10px_rgba(255,46,24,.6))_drop-shadow(0_0_36px_rgba(200,20,10,.4))]",
].join(" ");

const AURA =
  "pointer-events-none absolute -top-[9.94%] -left-[19.93%] z-2 h-[109.94%] w-[139.86%] max-w-none origin-[50%_70%] animate-aura-fx will-change-[opacity,transform] motion-reduce:animate-none";

export function HeroStage() {
  return (
    <div
      className="pointer-events-none @container phone:relative phone:-mt-30 phone:h-560 phone:w-full desk:relative desk:min-h-520 desk:self-stretch"
      aria-hidden="true"
    >
      <span className={GLOW} />
      <span className={`${SLASH} animate-slash-glow [transform:translate(-50%,-50%)_rotate(56deg)]`} />
      <span className={`${SLASH} animate-slash-glow-late [transform:translate(-50%,-50%)_rotate(-56deg)]`} />
      <span className={SHADOW} />
      <div className={FIGURE}>
        <div className={FIGURE_INNER}>
          <picture className={FIGHTER}>
            <source
              media={DESK}
              srcSet="/assets/site/hero-fighter-d.webp 1164w, /assets/site/hero-fighter-d@2x.webp 2328w"
              sizes="(min-height: 1100px) 1200px, 860px"
              width={1164}
              height={1398}
            />
            <img
              src="/assets/site/hero-fighter-m.webp"
              srcSet="/assets/site/hero-fighter-m.webp 640w, /assets/site/hero-fighter-d.webp 1164w"
              sizes="(min-width: 560px) 390px, 70vw"
              width={640}
              height={769}
              alt=""
              fetchPriority="high"
            />
          </picture>
          <Image
            className={AURA}
            src="/assets/site/fx/aura-sparks-d.webp"
            width={1628}
            height={1537}
            alt=""
            loading="eager"
            decoding="async"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
