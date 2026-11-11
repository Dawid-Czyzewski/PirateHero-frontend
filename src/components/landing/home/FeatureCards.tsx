import Image from "next/image";
import type { ReactNode } from "react";

type Feature = {
  id: string;
  title: string;
  image: { src: string; width: number; height: number; className: string };
  mobile: ReactNode;
  desktop: string;
  longTitle?: boolean;
};

const ICON = "block object-contain phone:-ml-8 phone:h-72 phone:w-72 phone:justify-self-center desk:static desk:m-0 desk:h-100 desk:w-100";
const CAR_ICON = "block object-contain phone:-ml-4 phone:h-60 phone:w-112 phone:justify-self-center desk:static desk:m-0 desk:h-100 desk:w-180";

const FEATURES: readonly Feature[] = [
  {
    id: "zlecenia",
    title: "Zlecenia",
    image: { src: "/assets/site/icons/zlecenia.webp", width: 160, height: 160, className: ICON },
    mobile: (
      <>
        Wykonuj codzienne
        <br />
        zadania za nagrody
      </>
    ),
    desktop: "Wysyłaj zawodnika na zlecenia na czas i odbieraj Cebuliony, Zasięgi i przedmioty.",
  },
  {
    id: "trening",
    title: "Trening",
    image: { src: "/assets/site/icons/trening.webp", width: 160, height: 160, className: ICON },
    mobile: (
      <>
        Trenuj swoje
        <br />
        statystyki (za Cebuliony)
      </>
    ),
    desktop: "Płać Cebulionami za trening i podnoś siłę, szybkość i technikę.",
  },
  {
    id: "gala",
    title: "Gale",
    image: { src: "/assets/site/icons/gala.webp", width: 160, height: 160, className: ICON },
    mobile: (
      <>
        Walcz w
        <br />
        turniejach
      </>
    ),
    desktop: "Walcz na galach o Cebuliony, Zasięgi i sławę w świecie freak fightów.",
  },
  {
    id: "auto",
    title: "Auto i wspomagacze",
    image: { src: "/assets/site/icons/auto.webp", width: 320, height: 122, className: CAR_ICON },
    mobile: (
      <>
        Ulepszaj auto
        <br />i zdobywaj bonusy
      </>
    ),
    desktop: "Lepsze auto skraca zlecenia, a wspomagacze dają bonus na kilka godzin.",
    longTitle: true,
  },
];

const CARD = [
  "fl-card phone:grid phone:h-108 phone:grid-cols-[calc(118*var(--k))_1fr] phone:items-center phone:p-0",
  "desk:flex desk:h-auto desk:min-h-280 desk:flex-col desk:items-center desk:px-22 desk:py-28 desk:text-center desk:max-[1199px]:min-h-0",
].join(" ");

const TITLE = [
  "phone:font-cond phone:leading-none phone:font-bold phone:tracking-[.01em] phone:whitespace-nowrap phone:text-[#f3eadb] phone:uppercase",
  "desk:mt-16 desk:text-[calc(28*var(--k))] desk:leading-[1.1] desk:whitespace-normal",
].join(" ");

const TEXT = [
  "phone:mt-9 phone:text-[calc(19*var(--k))] phone:leading-22 phone:text-[#e6e2dc]",
  "desk:mt-10 desk:text-[calc(19*var(--k))] desk:leading-[1.4] desk:text-[#ddd6cd]",
].join(" ");

export function FeatureCards() {
  return (
    <ul
      className="phone:mt-13 phone:grid phone:grid-cols-2 phone:gap-10 desk:static desk:mt-36 desk:grid desk:grid-cols-[repeat(4,minmax(0,1fr))] desk:gap-24 desk:max-[1199px]:grid-cols-[repeat(2,minmax(0,1fr))]"
      id="features"
    >
      {FEATURES.map((feature) => (
        <li className={CARD} key={feature.id}>
          <Image
            className={feature.image.className}
            src={feature.image.src}
            width={feature.image.width}
            height={feature.image.height}
            alt=""
            loading="lazy"
            decoding="async"
            unoptimized
          />
          <div>
            <h3
              className={`${TITLE} ${feature.longTitle ? "phone:text-[calc(23*var(--k))]" : "phone:text-[calc(26*var(--k))]"}`}
            >
              {feature.title}
            </h3>
            <p className={TEXT}>
              <span className="desk:hidden">{feature.mobile}</span>
              <span className="hidden desk:inline">{feature.desktop}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
