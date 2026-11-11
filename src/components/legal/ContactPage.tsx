import Image from "next/image";
import { ContactForm } from "@/components/legal/ContactForm";
import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteShell } from "@/components/site/SiteShell";
import { SOCIALS } from "@/components/site/socialIcons";

const HEAD = "phone:relative phone:h-247 desk:pt-52 desk:pb-30 desk-compact:pt-18 desk-compact:pb-14";

const HEAD_TITLE = "fl-art phone:top-64 phone:left-89 phone:w-538 desk:static desk:block desk:w-480";

const HEAD_LEAD = [
  "fl-lead",
  "phone:absolute phone:inset-x-0 phone:top-[calc(159.7*var(--k))] phone:text-center phone:text-[calc(27*var(--k))] phone:leading-35",
  "desk:mt-14 desk:text-left desk:text-[calc(23*var(--k))] desk:leading-[1.4]",
].join(" ");

const CONTACT_CARD = "fl-panel phone:mx-35 phone:mt-11 phone:px-40 phone:pt-24 phone:pb-34 phone:text-center desk:px-48 desk:pt-46 desk:pb-42";

const CONTACT_HEAD = "phone:mx-auto phone:block phone:w-175 phone:[&_img]:block phone:[&_img]:h-auto phone:[&_img]:w-full desk:w-180";

const MAIL = [
  "phone:[--pb:max(0px,calc(22px-17.7*var(--k)))] phone:mt-[calc(18*var(--k)-var(--pb))] phone:mb-[calc(-1*var(--pb))] phone:py-(--pb)",
  "phone:inline-flex phone:items-center phone:gap-22 phone:text-[calc(29.5*var(--k))] phone:font-medium phone:text-[#f4f1ec] phone:no-underline phone:hover:text-gold",
  "desk:mt-22 desk:inline-flex desk:gap-14 desk:text-[calc(25*var(--k))]",
].join(" ");

const SOCIAL_LIST = [
  "phone:mt-12 phone:flex phone:justify-center phone:gap-[max(0px,calc(84*var(--k)-44px))]",
  "desk:mt-18 desk:flex desk:justify-center desk:gap-18",
].join(" ");

const SOCIAL_LINK = [
  "phone:relative phone:isolate phone:grid phone:size-[max(calc(58*var(--k)),44px)] phone:place-items-center phone:text-parchment phone:hover:text-white",
  "phone:before:absolute phone:before:top-1/2 phone:before:left-1/2 phone:before:-z-1 phone:before:size-58 phone:before:[transform:translate(-50%,-50%)] phone:before:content-['']",
  "phone:before:rounded-full phone:before:border-[calc(2*var(--k))] phone:before:border-gold/50",
  "phone:before:bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.08),rgba(255,255,255,0)_70%)]",
  "phone:hover:before:border-fire phone:hover:before:bg-[#9e1f18]",
  "desk:size-54 phone:[&_svg]:size-28 desk:[&_svg]:size-24",
].join(" ");

const FIGHTER_IMAGE = [
  "desk:absolute desk:bottom-16 desk:left-1/2 desk:aspect-[1.55] desk:h-[calc(100%-46*var(--k))] desk:w-auto desk:max-w-[calc(100%-92*var(--k))]",
  "desk:-translate-x-1/2 desk:object-cover desk:object-bottom",
].join(" ");

function MailIcon() {
  return (
    <svg className="phone:h-38 phone:w-52 phone:flex-none desk:h-28 desk:w-38" viewBox="0 0 44 32" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" d="M2 2h40v28H2z" />
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

function SocialList() {
  return (
    <ul className={SOCIAL_LIST} aria-label="Freak Legends w mediach społecznościowych">
      {SOCIALS.map(({ name, href, Icon }) => (
        <li key={name}>
          <a className={SOCIAL_LINK} href={href} aria-label={`Freak Legends na ${name}`}>
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
      <section className={HEAD} aria-labelledby="k-h">
        <h1 id="k-h">
          <ArtPicture
            className={HEAD_TITLE}
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
        <p className={HEAD_LEAD}>
          Pytanie, błąd w grze albo współpraca?
          <br className="desk:hidden" /> Odpowiadamy
          <br className="hidden desk:inline" /> zwykle w&nbsp;1–2 dni robocze.
        </p>
      </section>

      <div className="desk:grid desk:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] desk:items-stretch desk:gap-32">
        <section
          className="fl-panel phone:mx-35 phone:pt-28 phone:pr-64 phone:pb-30 phone:pl-60 desk:px-60 desk:pt-52 desk:pb-50"
          id="formularz"
          aria-label="Formularz kontaktowy"
        >
          <ContactForm />
        </section>

        <aside className="desk:flex desk:flex-col desk:gap-22 desk:overflow-visible" aria-label="Dane kontaktowe">
          <section className={CONTACT_CARD} aria-labelledby="c-h">
            <h2 id="c-h">
              <ArtPicture
                className={CONTACT_HEAD}
                srcD="/assets/site/head-kontakt-d-kontakt.webp"
                srcM="/assets/site/head-kontakt-m-kontakt.webp"
                alt="Kontakt"
                widthM={350}
                heightM={84}
                widthD={242}
                heightD={62}
              />
            </h2>
            <a className={MAIL} href="mailto:kontakt@dawid-developer.pl">
              <MailIcon />
              <span>kontakt@dawid-developer.pl</span>
            </a>
            <p className="phone:mt-14 phone:text-[calc(21*var(--k))] phone:text-[#dcd7d0] desk:mt-10 desk:text-[calc(19*var(--k))]">
              Odpowiadamy w&nbsp;dni robocze.
            </p>
            <div className="desk:hidden">
              <SocialList />
            </div>
          </section>
          <section
            className="fl-panel phone:hidden desk:block desk:px-40 desk:pt-38 desk:pb-40 desk:text-center"
            aria-labelledby="z-h"
          >
            <h2 id="z-h" className="desk:mx-auto desk:w-[min(calc(260*var(--k)),100%)]">
              <Image
                className="desk:h-auto desk:w-full"
                src="/assets/site/head-kontakt-d-znajdz.webp"
                width={304}
                height={70}
                alt="Znajdź nas"
                unoptimized
              />
            </h2>
            <SocialList />
          </section>
          <div
            className="fl-panel phone:hidden desk:relative desk:block desk:min-h-280 desk:flex-[1_1_auto]"
            aria-hidden="true"
          >
            <Image
              className={FIGHTER_IMAGE}
              src="/assets/site/fighter-kontakt-d.webp"
              width={816}
              height={510}
              alt=""
              loading="lazy"
              unoptimized
            />
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}
