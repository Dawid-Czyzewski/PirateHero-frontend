import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { DESK } from "@/components/site/ArtPicture";

const FEATURES = [
  {
    icon: "zlecenia",
    title: "Zlecenia",
    m: (
      <>
        Wykonuj codzienne
        <br />
        zadania za nagrody
      </>
    ),
    d: "Wysyłaj zawodnika na zlecenia na czas i odbieraj Cebuliony, Zasięgi i przedmioty.",
  },
  {
    icon: "trening",
    title: "Trening",
    m: (
      <>
        Trenuj swoje
        <br />
        statystyki (za Cebuliony)
      </>
    ),
    d: "Płać Cebulionami za trening i podnoś siłę, szybkość i technikę.",
  },
  {
    icon: "gala",
    title: "Gale",
    m: (
      <>
        Walcz w
        <br />
        turniejach
      </>
    ),
    d: "Walcz na galach o Cebuliony, Zasięgi i sławę w świecie freak fightów.",
  },
] as const;

export function HomePage() {
  return (
    <SiteShell page="index">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero__beams" aria-hidden="true">
          <span className="hero__beam hero__beam--l" />
          <span className="hero__beam hero__beam--r" />
        </div>
        <div className="hero__fx" aria-hidden="true">
          <span className="emb emb--back">
            <i />
          </span>
        </div>
        <div className="hero__fx hero__fx--br" aria-hidden="true">
          <span className="emb emb--mid">
            <i />
          </span>
        </div>
        <div className="hero__stage" aria-hidden="true">
          <span className="hero__glow" />
          <span className="hero__slash hero__slash--a" />
          <span className="hero__slash hero__slash--b" />
          <span className="hero__shadow" />
          <div className="hero__fig">
            <div className="hero__figin">
              <picture className="hero__fighter">
                <source
                  media={DESK}
                  srcSet="/assets/site/hero-fighter-d.webp 1164w, /assets/site/hero-fighter-d@2x.webp 2328w"
                  sizes="(min-height: 1100px) 1200px, 860px"
                  width={1164}
                  height={1398}
                />
                { }
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero__aurafx"
                src="/assets/site/fx/aura-sparks-d.webp"
                width={1628}
                height={1537}
                alt=""
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className="hero__fx hero__fx--front" aria-hidden="true">
          <span className="emb emb--near">
            <i />
          </span>
        </div>
        <div className="hero__copy">
          <h1 id="hero-h" className="hero__h1">
            <picture className="hero__title">
              <source
                media={DESK}
                srcSet="/assets/site/head-index-d-hero.webp 858w, /assets/site/head-index-d-hero@2x.webp 1716w"
                sizes="(min-width: 1800px) 1000px, 760px"
                width={858}
                height={290}
              />
              { }
              <img
                src="/assets/site/head-index-m-hero.webp"
                width={1040}
                height={384}
                alt="Zostań Freak Legendą"
                decoding="async"
              />
            </picture>
          </h1>
          <p className="lead hero__lead">
            Przeglądarkowe RPG w&nbsp;świecie fikcyjnych freak fightów.
            <br /> Graj za darmo na telefonie i&nbsp;komputerze.
          </p>
          <div className="hero__btns">
            <Link className="btn btn--gold btn--shine" href="/register">
              <span>Zagraj za darmo</span>
              <i className="btn__shine" aria-hidden="true" />
            </Link>
            <Link className="btn btn--dark" href="/login">
              <span>Zaloguj</span>
            </Link>
          </div>
          <ul className="perks" aria-label="Najważniejsze cechy gry">
            <li className="perk perk--www">
              <svg viewBox="0 0 48 40" aria-hidden="true">
                <rect
                  x="2"
                  y="3"
                  width="44"
                  height="34"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path d="M2 12h44" stroke="currentColor" strokeWidth="3" />
                <circle cx="8" cy="7.6" r="1.8" fill="currentColor" />
                <circle cx="14" cy="7.6" r="1.8" fill="currentColor" />
                <circle cx="20" cy="7.6" r="1.8" fill="currentColor" />
                <path
                  d="M10 20h18M10 26h28M10 31h12"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity=".7"
                />
              </svg>
              <span>
                Darmowa gra
                <br /> w przeglądarce
              </span>
            </li>
            <li className="perk perk--dev">
              <svg viewBox="0 0 56 40" aria-hidden="true">
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="32"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M8 31h4"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M24 8h26a2 2 0 0 1 2 2v20H22V10a2 2 0 0 1 2-2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M18 34h36l-2 3H20z" fill="currentColor" />
              </svg>
              <span>
                Telefon
                <br /> i komputer
              </span>
            </li>
            <li className="perk perk--star">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path
                  d="M20 2.5l5.3 11.2 12.2 1.5-9 8.4 2.4 12.1L20 29.7 9.1 35.7l2.4-12.1-9-8.4 12.2-1.5z"
                  fill="currentColor"
                  stroke="#7a5418"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 7.5l3.6 7.7 8.3 1-6.1 5.7"
                  fill="none"
                  stroke="#fff3c4"
                  strokeWidth="1.4"
                  opacity=".7"
                />
              </svg>
              <span>
                Fikcyjne gwiazdy
                <br /> freak fightów
              </span>
            </li>
          </ul>
        </div>
      </section>

      <div className="col">
        <section className="about-wrap" id="about" aria-labelledby="about-h">
          <div className="about panel">
            <h2 className="plate" id="about-h">
              Czym jest gra?
            </h2>
            <a
              className="hero__scroll"
              href="#features"
              aria-label="Przewiń do opisu gry"
            >
              <svg viewBox="0 0 40 24" aria-hidden="true">
                <path
                  d="M4 4l16 16L36 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <p className="about__text">
              Odkryj mroczny świat fikcyjnych freak fightów.
              <br /> Trenuj, walcz i&nbsp;zostań największą legendą oktagonu.
            </p>
          </div>
          <ul className="features" id="features">
            {FEATURES.map((f) => (
              <li className="card feat" key={f.icon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ico"
                  src={`/assets/site/icons/${f.icon}.webp`}
                  width={160}
                  height={160}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="feat__txt">
                  <h3>{f.title}</h3>
                  <p>
                    <span className="m-only">{f.m}</span>
                    <span className="d-only">{f.d}</span>
                  </p>
                </div>
              </li>
            ))}
            <li className="card feat feat--long">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ico ico--car"
                src="/assets/site/icons/auto.webp"
                width={320}
                height={122}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="feat__txt">
                <h3>Auto i wspomagacze</h3>
                <p>
                  <span className="m-only">
                    Ulepszaj auto
                    <br />i zdobywaj bonusy
                  </span>
                  <span className="d-only">
                    Lepsze auto skraca zlecenia, a wspomagacze dają bonus na kilka
                    godzin.
                  </span>
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className="cta" aria-labelledby="cta-h">
          <h2 id="cta-h">Gotowy na pierwszą galę?</h2>
          <Link className="btn btn--gold" href="/register">
            <span>Zagraj za darmo</span>
          </Link>
        </section>
      </div>
    </SiteShell>
  );
}
