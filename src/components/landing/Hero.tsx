import Image from "next/image";
import { PageFrame } from "./PageFrame";
import { SkewButton } from "./SkewButton";

const fighterFrame = [
  "pointer-events-none absolute z-[5] hidden md:block",
  "bottom-[-10%] right-[14%] h-[min(72vh,640px)] w-[min(54%,460px)]",
  "lg:bottom-[-14%] lg:right-auto lg:left-[72%] lg:h-[min(121vh,1166px)] lg:w-[min(72vw,950px)] lg:-translate-x-1/2",
  "xl:bottom-[-8%] xl:left-[54%] xl:h-[min(96vh,860px)] xl:w-[min(52vw,700px)]",
  "2xl:left-[50%]",
].join(" ");

function TrailerBox() {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden border border-white/15 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center">
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-sm text-white"
          aria-hidden
        >
          ▶
        </span>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">
          Trailer
        </p>
        <p className="text-[0.7rem] leading-relaxed text-zinc-400">
          Wkrótce pojawi się tutaj film promocyjny Freak Legends.
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative z-0 w-full overflow-x-clip overflow-y-visible bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/bg-octagon.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
      </div>

      <div className={fighterFrame}>
        <Image
          src="/images/hero-fighter-v4.png"
          alt="Zawodnik Freak Legends w stroju MMA"
          width={605}
          height={676}
          className="h-full w-full object-contain object-bottom select-none drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
        />
      </div>

      <PageFrame className="relative z-20 grid min-h-[calc(100vh-4.5rem)] items-start gap-8 pb-28 pt-24 lg:grid-cols-12 lg:items-center lg:pb-16 lg:pt-28">
        <div className="flex w-full max-w-xl flex-col lg:col-span-5">
          <h1 className="sr-only">Zostań legendą świata freak fightów</h1>
          <Image
            src="/images/hero-headline-v3.png"
            alt="Zostań legendą świata freak fightów"
            width={1600}
            height={1078}
            priority
            sizes="(max-width: 1024px) 80vw, 28rem"
            className="h-auto w-full max-w-[22rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] md:max-w-[20rem] lg:max-w-[26rem] xl:max-w-[30rem]"
          />

          <div className="mt-5 min-w-0 md:max-w-[17rem] lg:max-w-md">
            <p className="text-[0.92rem] leading-relaxed text-zinc-200">
              Trenuj, walcz, buduj popularność i zdobądź szczyt! Freak Legends to
              przeglądarkowa gra RPG, w której tworzysz własnego zawodnika i
              piszesz jego historię w świecie freak fightów.
            </p>
            <div className="mt-7">
              <SkewButton href="/register" size="lg">
                Zacznij grę
              </SkewButton>
            </div>
          </div>
        </div>

        <aside
          id="trailer"
          aria-label="Trailer gry"
          className="relative z-20 mt-8 w-full max-w-md md:absolute md:right-0 md:top-28 md:mt-0 md:w-[22rem] md:max-w-none lg:static lg:col-span-5 lg:col-start-8 lg:mt-0 lg:w-full lg:max-w-[36rem] lg:justify-self-end lg:self-center xl:col-span-4 xl:col-start-9 xl:max-w-[32rem]"
        >
          <TrailerBox />
        </aside>
      </PageFrame>
    </section>
  );
}
