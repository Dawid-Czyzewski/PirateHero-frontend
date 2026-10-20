import Image from "next/image";
import { ABOUT_FEATURES, type AboutFeature } from "@/components/landing/aboutFeatures";
import { PageFrame } from "@/components/landing/PageFrame";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

function FeatureCard({
  feature,
  priority,
}: {
  feature: AboutFeature;
  priority?: boolean;
}) {
  const headingId = `about-${feature.id}-title`;

  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-sm border border-red-600/35 bg-[#141414]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
      aria-labelledby={headingId}
    >
      <span
        className="pointer-events-none absolute right-0 top-0 z-10 h-8 w-8 border-r-2 border-t-2 border-red-600"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-8 w-8 border-b-2 border-l-2 border-red-600"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(0,0,0,0.25)_100%)]"
        aria-hidden
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"
          aria-hidden
        />
        <span
          className="absolute left-3 top-2 z-[2] text-[1.35rem] font-extrabold tracking-wide text-red-600 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
          aria-hidden
        >
          {feature.number}.
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-5 pt-3 sm:px-5">
        <h2
          id={headingId}
          className="text-[0.95rem] font-extrabold uppercase tracking-[0.06em] text-white"
        >
          <span className="sr-only">{feature.number}. </span>
          {feature.title}
        </h2>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-zinc-300">
          {feature.text}
        </p>
      </div>
    </article>
  );
}

export function AboutGame() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip overflow-y-clip bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src="/bg-octagon.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/15 to-[#0a0a0a]/50" />
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-[-2%] z-[5] hidden h-[min(92vh,860px)] w-[min(46vw,640px)] xl:block 2xl:right-[2%]"
          aria-hidden
        >
          <Image
            src="/images/hero-fighter-v4.png"
            alt=""
            width={605}
            height={676}
            loading="lazy"
            sizes="(max-width: 1279px) 0px, 700px"
            className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)]"
          />
        </div>

        <SiteHeader />

        <main className="relative z-20 flex flex-col pb-14 pt-24 md:pb-16 md:pt-28">
          <PageFrame>
            <header className="mb-5 max-w-xl sm:mb-6 lg:max-w-2xl">
              <h1 className="sr-only">
                O grze Freak Legends — przeglądarkowe RPG o freak fightach
              </h1>
              <Image
                src="/images/about-headline-v5.png"
                alt=""
                width={1258}
                height={639}
                priority
                sizes="(max-width: 768px) 90vw, 36rem"
                className="h-auto w-full max-w-[20rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:max-w-[24rem] lg:max-w-[28rem]"
              />
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-zinc-200 sm:text-base">
                Freak Legends to darmowa gra przeglądarkowa RPG w świecie freak
                fightów. Trenuj zawodnika, buduj hype, walcz PvP w oktagonie i
                zdobywaj pasy mistrzowskie — bez instalacji, od razu w
                przeglądarce.
              </p>
            </header>

            <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {ABOUT_FEATURES.map((feature, index) => (
                <li key={feature.id} id={feature.id}>
                  <FeatureCard feature={feature} priority={index === 0} />
                </li>
              ))}
            </ul>
          </PageFrame>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
