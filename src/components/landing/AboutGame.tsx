import Link from "next/link";
import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteShell } from "@/components/site/SiteShell";

const MECH = [
  {
    icon: "rekawice",
    w: 160,
    h: 160,
    title: "Postać i statystyki",
    text: "Rozwijaj siłę, szybkość i technikę.",
  },
  {
    icon: "zlecenia",
    w: 160,
    h: 160,
    title: "Zlecenia na czas",
    text: "Wykonuj misje na czas po cenne nagrody.",
  },
  {
    icon: "trening",
    w: 160,
    h: 160,
    title: "Trening",
    text: "Ćwicz za Cebuliony i podbijaj statystyki.",
  },
  {
    icon: "gala",
    w: 160,
    h: 160,
    title: "Gale",
    text: "Bierz udział w walkach o wysokie stawki.",
  },
  {
    icon: "energetyk",
    w: 160,
    h: 160,
    title: "Wspomagacze czasowe",
    text: "Energetyk lub trener: bonus na kilka godzin.",
  },
  {
    icon: "auto",
    w: 320,
    h: 122,
    car: true as const,
    title: "Auta skracają zlecenia",
    text: "Lepsze auto – szybsze zlecenia.",
  },
  {
    icon: "ekwipunek",
    w: 160,
    h: 160,
    title: "Plecak – 16 slotów",
    text: "Miejsce na przedmioty i wspomagacze.",
  },
  {
    icon: "przepustka",
    w: 160,
    h: 160,
    title: "Przepustka sezonowa",
    text: "Zbieraj Medale i odbieraj nagrody sezonu.",
  },
];

type MechItem = (typeof MECH)[number];
function mechIconClass(item: MechItem) {
  return "car" in item && item.car ? "ico ico--car" : "ico";
}

export function AboutGame() {
  return (
    <SiteShell page="ogrze">
      <section className="head" aria-labelledby="og-h">
        <h1 id="og-h">
          <ArtPicture
            className="art head__title"
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
        <p className="lead head__lead">
          Świat fikcyjnych freak fightów: od lokalnych gal do wielkiej sławy.
        </p>
      </section>

      <section className="world panel" aria-labelledby="world-h">
        <h2 id="world-h">Świat gry</h2>
        <div className="world__text">
          <p>
            Witaj w brutalnym świecie fikcyjnych walk. Stwórz swojego
            zawodnika i&nbsp;poprowadź go na sam szczyt.
          </p>
          <p>
            Od lokalnych hal do wielkich aren – twoja legenda zaczyna się tutaj.
            Trenuj, walcz i&nbsp;zdobywaj sławę.
          </p>
        </div>
        <ArtPicture
          className="art world__fighter"
          srcD="/assets/site/fighter-ogrze-d.webp"
          srcM="/assets/site/fighter-ogrze-m.webp"
          alt=""
          widthM={616}
          heightM={654}
          widthD={588}
          heightD={592}
        />
      </section>

      <section className="mech panel" id="mechaniki" aria-labelledby="mech-h">
        <h2 className="plate" id="mech-h">
          Mechaniki
        </h2>
        <ul className="mech__list">
          {MECH.map((item) => (
            <li key={item.icon} className="card mcard">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={mechIconClass(item)}
                src={`/assets/site/icons/${item.icon}.webp`}
                width={item.w}
                height={item.h}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="cta">
        <Link className="btn btn--gold" href="/register">
          <span>Zagraj za darmo</span>
        </Link>
      </div>
    </SiteShell>
  );
}
