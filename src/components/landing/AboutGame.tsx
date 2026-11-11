import Image from "next/image";
import Link from "next/link";
import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteShell } from "@/components/site/SiteShell";

type Mechanic = {
  icon: string;
  width: number;
  height: number;
  title: string;
  text: string;
  car?: boolean;
};

const MECHANICS: readonly Mechanic[] = [
  { icon: "rekawice", width: 160, height: 160, title: "Postać i statystyki", text: "Rozwijaj siłę, szybkość i technikę." },
  { icon: "zlecenia", width: 160, height: 160, title: "Zlecenia na czas", text: "Wykonuj misje na czas po cenne nagrody." },
  { icon: "trening", width: 160, height: 160, title: "Trening", text: "Ćwicz za Cebuliony i podbijaj statystyki." },
  { icon: "gala", width: 160, height: 160, title: "Gale", text: "Bierz udział w walkach o wysokie stawki." },
  { icon: "energetyk", width: 160, height: 160, title: "Wspomagacze czasowe", text: "Energetyk lub trener: bonus na kilka godzin." },
  { icon: "auto", width: 320, height: 122, title: "Auta skracają zlecenia", text: "Lepsze auto – szybsze zlecenia.", car: true },
  { icon: "ekwipunek", width: 160, height: 160, title: "Plecak – 16 slotów", text: "Miejsce na przedmioty i wspomagacze." },
  { icon: "przepustka", width: 160, height: 160, title: "Przepustka sezonowa", text: "Zbieraj Medale i odbieraj nagrody sezonu." },
];

const HEAD = "phone:relative phone:h-182 desk:pt-52 desk:pb-36 desk:text-center desk-compact:pt-18 desk-compact:pb-12";

const HEAD_TITLE = "fl-art phone:top-13 phone:left-203 phone:w-333 desk:static desk:mx-auto desk:block desk:w-380 desk-compact:w-280";

const HEAD_LEAD = [
  "fl-lead",
  "phone:absolute phone:inset-x-0 phone:top-[calc(113.4*var(--k))] phone:pl-19 phone:text-center phone:text-[calc(24*var(--k))] phone:leading-30 phone:whitespace-nowrap",
  "desk:mt-14 desk:text-[calc(25*var(--k))] desk-compact:mt-8 desk-compact:text-[calc(22*var(--k))]",
].join(" ");

const WORLD = [
  "fl-panel phone:mx-36 phone:h-328 phone:pt-39 phone:pl-41",
  "desk:grid desk:min-h-420 desk:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] desk:grid-rows-[auto_1fr] desk:gap-x-48 desk:overflow-visible",
  "desk:[--world-pt:calc(60*var(--k))] desk:[--world-pb:calc(56*var(--k))] desk:pt-(--world-pt) desk:pr-56 desk:pb-(--world-pb) desk:pl-72",
  "desk-compact:[--world-pt:calc(44*var(--k))] desk-compact:[--world-pb:calc(40*var(--k))] desk-compact:min-h-400 desk-compact:pr-48 desk-compact:pl-48",
].join(" ");

const WORLD_TITLE = [
  "phone:mt-0 phone:font-cond phone:text-[calc(45*var(--k))] phone:leading-none phone:font-bold phone:tracking-[.08em] phone:text-[#f3eadb] phone:uppercase",
  "desk:relative desk:z-2 desk:col-start-1 desk:m-0 desk:text-[calc(54*var(--k))] desk:tracking-[.06em] desk-compact:text-[calc(42*var(--k))]",
].join(" ");

const WORLD_TEXT = [
  "phone:relative phone:z-2 phone:mt-17 phone:w-300 phone:text-[calc(23*var(--k))] phone:leading-31 phone:font-medium",
  "desk:relative desk:z-2 desk:col-start-1 desk:mt-20 desk:max-w-640 desk:text-[calc(22*var(--k))] desk:leading-[1.5]",
  "desk-compact:mt-12 desk-compact:text-[calc(20*var(--k))]",
].join(" ");

const WORLD_FIGHTER = [
  "fl-art",
  "phone:top-40 phone:right-46 phone:bottom-16 phone:left-auto phone:z-1 phone:w-270",
  "phone:[&_img]:absolute phone:[&_img]:inset-0 phone:[&_img]:h-full phone:[&_img]:w-full phone:[&_img]:object-contain phone:[&_img]:object-bottom",
  "desk:relative desk:z-1 desk:col-start-2 desk:row-span-2 desk:row-start-1 desk:min-h-0 desk:w-auto desk:self-stretch desk:justify-self-stretch",
  "desk:mt-[calc(46*var(--k)-var(--world-pt))] desk:mb-[calc(16*var(--k)-var(--world-pb))]",
  "desk:[&_img]:absolute desk:[&_img]:inset-0 desk:[&_img]:block desk:[&_img]:h-full desk:[&_img]:w-full desk:[&_img]:object-contain desk:[&_img]:object-bottom",
].join(" ");

const MECH = [
  "fl-panel phone:mx-36 phone:mt-45 phone:px-33 phone:pt-55 phone:pb-33",
  "desk:mt-56 desk:px-44 desk:pt-80 desk:pb-48 desk-compact:mt-36 desk-compact:px-36 desk-compact:pt-64 desk-compact:pb-36",
].join(" ");

const MECH_CARD = [
  "fl-card phone:grid phone:h-102 phone:grid-cols-[calc(118*var(--k))_1fr] phone:items-center",
  "desk:grid desk:min-h-124 desk:grid-cols-[calc(120*var(--k))_minmax(0,1fr)] desk:items-center desk:pt-16 desk:pr-24 desk:pb-16 desk:pl-6",
].join(" ");

const MECH_ICON = {
  standard: "block h-88 w-88 justify-self-center object-contain",
  car: "block w-110 justify-self-center object-contain phone:h-60 desk:h-64",
} as const;

const MECH_TITLE = [
  "phone:font-cond phone:text-[calc(30.5*var(--k))] phone:leading-none phone:font-bold phone:tracking-[.01em] phone:text-[#f3eadb] phone:uppercase",
  "desk:text-[calc(27*var(--k))] desk:leading-[1.1] desk:whitespace-normal",
].join(" ");

const MECH_TEXT = [
  "phone:mt-12 phone:text-[calc(23*var(--k))] phone:leading-25 phone:text-[#e6e2dc]",
  "desk:mt-8 desk:text-[calc(20*var(--k))] desk:leading-[1.4]",
].join(" ");

export function AboutGame() {
  return (
    <SiteShell page="ogrze">
      <section className={HEAD} aria-labelledby="og-h">
        <h1 id="og-h">
          <ArtPicture
            className={HEAD_TITLE}
            srcD="/assets/site/head-ogrze-d-title.webp"
            srcM="/assets/site/head-ogrze-m-title.webp"
            alt="O grze"
            widthM={666}
            heightM={168}
            widthD={436}
            heightD={116}
            loading="eager"
          />
        </h1>
        <p className={HEAD_LEAD}>Świat fikcyjnych freak fightów: od lokalnych gal do wielkiej sławy.</p>
      </section>

      <section className={WORLD} aria-labelledby="world-h">
        <h2 id="world-h" className={WORLD_TITLE}>
          Świat gry
        </h2>
        <div className={WORLD_TEXT}>
          <p>
            Witaj w brutalnym świecie fikcyjnych walk. Stwórz swojego zawodnika i&nbsp;poprowadź go na sam szczyt.
          </p>
          <p className="phone:mt-5 desk:mt-18">
            Od lokalnych hal do wielkich aren – twoja legenda zaczyna się tutaj. Trenuj, walcz i&nbsp;zdobywaj sławę.
          </p>
        </div>
        <ArtPicture
          className={WORLD_FIGHTER}
          srcD="/assets/site/fighter-ogrze-d.webp"
          srcM="/assets/site/fighter-ogrze-m.webp"
          alt=""
          widthM={616}
          heightM={654}
          widthD={588}
          heightD={592}
        />
      </section>

      <section className={MECH} id="mechaniki" aria-labelledby="mech-h">
        <h2 className="fl-plate phone:-top-8 phone:h-54 phone:w-290 phone:[--fs:38] desk:[--fs:32]" id="mech-h">
          Mechaniki
        </h2>
        <ul className="phone:flex phone:flex-col phone:gap-9 desk:grid desk:grid-cols-2 desk:gap-18">
          {MECHANICS.map((item) => (
            <li key={item.icon} className={MECH_CARD}>
              <Image
                className={item.car ? MECH_ICON.car : MECH_ICON.standard}
                src={`/assets/site/icons/${item.icon}.webp`}
                width={item.width}
                height={item.height}
                alt=""
                loading="lazy"
                decoding="async"
                unoptimized
              />
              <div>
                <h3 className={MECH_TITLE}>{item.title}</h3>
                <p className={MECH_TEXT}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-center phone:mt-34 desk:mt-40">
        <Link
          className="fl-btn phone:h-64 phone:w-428 phone:[--fs:32] desk:h-66 desk:w-380 desk:tracking-[.05em] desk:[--fs:30]"
          href="/register"
        >
          <span>Zagraj za darmo</span>
        </Link>
      </div>
    </SiteShell>
  );
}
