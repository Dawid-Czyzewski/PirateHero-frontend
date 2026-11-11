import Link from "next/link";
import { Perks } from "@/components/landing/home/Perks";
import { DESK } from "@/components/site/ArtPicture";

const HERO_BUTTON = [
  "fl-btn desk:h-78 desk:w-auto desk:min-w-0 desk:tracking-[.05em]",
  "phone:tracking-[.04em] desk:max-[1199px]:h-64 desk:max-[1199px]:[--fs:28]",
].join(" ");

const SHINE = [
  "pointer-events-none absolute inset-[calc(-1*var(--bw)+5*var(--k))] overflow-hidden rounded-[8px] motion-reduce:hidden",
  "before:absolute before:inset-y-0 before:left-0 before:w-[45%] before:mix-blend-soft-light before:content-['']",
  "before:bg-[linear-gradient(105deg,rgba(255,255,255,0)_20%,rgba(255,250,225,.55)_50%,rgba(255,255,255,0)_80%)]",
  "before:[transform:translateX(-120%)] before:animate-shine before:will-change-transform motion-reduce:before:animate-none",
].join(" ");

export function HeroCopy() {
  return (
    <div className="phone:relative phone:z-3 phone:flex phone:w-full phone:flex-col phone:items-center phone:text-center desk:flex desk:flex-col desk:items-center desk:pt-16 desk:pb-52 desk:text-center">
      <h1 id="hero-h" className="animate-hero-in motion-reduce:animate-none desk:flex desk:justify-center desk:self-stretch">
        <picture className="block [&_img]:h-auto [&_img]:w-full phone:-mt-96 phone:w-600 desk:w-[min(100%,calc(780*var(--k)),calc((100dvh-var(--head))*.9))]">
          <source
            media={DESK}
            srcSet="/assets/site/head-index-d-hero.webp 858w, /assets/site/head-index-d-hero@2x.webp 1716w"
            sizes="(min-width: 1800px) 1000px, 760px"
            width={858}
            height={290}
          />
          <img
            src="/assets/site/head-index-m-hero.webp"
            width={1040}
            height={384}
            alt="Zostań Freak Legendą"
            decoding="async"
          />
        </picture>
      </h1>
      <p className="fl-lead animate-fade-up-1 motion-reduce:animate-none phone:mt-2 phone:text-[calc(22*var(--k))] phone:leading-28 desk:mt-14 desk:max-w-[min(100%,calc(720*var(--k)))] desk:text-[min(calc(27*var(--k)),2.1vw)] desk:leading-[1.38] desk:text-balance">
        Przeglądarkowe RPG w&nbsp;świecie fikcyjnych freak fightów.
        <br /> Graj za darmo na telefonie i&nbsp;komputerze.
      </p>
      <div className="animate-fade-up-2 motion-reduce:animate-none phone:mt-22 phone:flex phone:w-560 phone:flex-col phone:gap-14 desk:mt-30 desk:flex desk:w-[min(100%,calc(600*var(--k)))] desk:gap-18">
        <Link
          className={`${HERO_BUTTON} overflow-visible [--fs:34] phone:h-76 desk:flex-[1.4_1_0]`}
          href="/register"
        >
          <span>Zagraj za darmo</span>
          <i className={SHINE} aria-hidden="true" />
        </Link>
        <Link className={`${HERO_BUTTON} fl-btn-dark [--fs:32] phone:h-68 desk:flex-[1_1_0]`} href="/login">
          <span>Zaloguj</span>
        </Link>
      </div>
      <Perks />
    </div>
  );
}
