import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteShell } from "@/components/site/SiteShell";
import { SOCIALS } from "@/components/site/socialIcons";
import { ContactForm } from "@/components/legal/ContactForm";

function MailIcon() {
  return (
    <svg viewBox="0 0 44 32" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        d="M2 2h40v28H2z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        d="M2 2l20 16L42 2M2 30l15-14M42 30L27 16"
      />
    </svg>
  );
}

function SocialList({ className }: { className?: string }) {
  return (
    <ul
      className={className ?? "contact__social"}
      aria-label="Freak Legends w mediach społecznościowych"
    >
      {SOCIALS.map(({ name, href, Icon }) => (
        <li key={name}>
          <a href={href} aria-label={`Freak Legends na ${name}`}>
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ContactPageView() {
  return (
    <SiteShell page="kontakt">
      <section className="head" aria-labelledby="k-h">
        <h1 id="k-h">
          <ArtPicture
            className="art head__title"
            srcD="/assets/site/head-kontakt-d-title.webp"
            srcM="/assets/site/head-kontakt-m-title.webp"
            alt="Napisz do nas"
            widthM={1076}
            heightM={170}
            widthD={826}
            heightD={132}
            loading="eager"
          />
        </h1>
        <p className="lead head__lead">
          Pytanie, błąd w grze albo współpraca?
          <br className="br-m" /> Odpowiadamy
          <br className="br-d" /> zwykle w&nbsp;1–2 dni robocze.
        </p>
      </section>

      <div className="kgrid">
        <section
          className="form-panel panel"
          id="formularz"
          aria-label="Formularz kontaktowy"
        >
          <ContactForm />
        </section>

        <aside className="kside" aria-label="Dane kontaktowe">
          <section className="contact panel" aria-labelledby="c-h">
            <h2 id="c-h">
              <ArtPicture
                className="contact__head"
                srcD="/assets/site/head-kontakt-d-kontakt.webp"
                srcM="/assets/site/head-kontakt-m-kontakt.webp"
                alt="Kontakt"
                widthM={350}
                heightM={84}
                widthD={242}
                heightD={62}
              />
            </h2>
            <a className="contact__mail" href="mailto:kontakt@dawid-developer.pl">
              <MailIcon />
              <span>kontakt@dawid-developer.pl</span>
            </a>
            <p className="contact__note">Odpowiadamy w&nbsp;dni robocze.</p>
            <div className="contact__social-m">
              <SocialList />
            </div>
          </section>
          <section className="contact__znajdz panel" aria-labelledby="z-h">
            <h2 id="z-h">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="contact__zhead"
                src="/assets/site/head-kontakt-d-znajdz.webp"
                width={304}
                height={70}
                alt="Znajdź nas"
              />
            </h2>
            <SocialList />
          </section>
          <div className="contact__fighter panel" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="contact__fighter-img"
              src="/assets/site/fighter-kontakt-d.webp"
              width={816}
              height={510}
              alt=""
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
