import Link from "next/link";
import type { ReactNode } from "react";
import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  AUTH_ART,
  AUTH_BACKDROP,
  AUTH_FIGHTER,
  AUTH_LOGO,
  AUTH_LOGO_PICTURE,
  AUTH_PANEL,
  AUTH_ROOT,
  AUTH_SCENE,
  AUTH_STAGE,
  AUTH_SWITCH,
  AUTH_VIEW,
  type AuthView,
} from "@/components/auth/authStyles";

const ASSETS = {
  login: {
    fighter: {
      srcD: "/assets/auth/fighter-login-d.webp",
      srcM: "/assets/auth/fighter-login-m.webp",
      widthM: 702,
      heightM: 750,
      widthD: 1164,
      heightD: 1398,
    },
    logo: {
      srcD: "/assets/auth/logo-login-d.webp",
      srcM: "/assets/auth/logo-login-m.webp",
      widthM: 618,
      heightM: 334,
      widthD: 450,
      heightD: 256,
    },
    title: {
      srcD: "/assets/auth/title-login-d.webp",
      srcM: "/assets/auth/title-login-m.webp",
      alt: "Wróć do oktagonu",
      widthM: 850,
      heightM: 392,
      widthD: 946,
      heightD: 154,
    },
  },
  register: {
    fighter: {
      srcD: "/assets/auth/fighter-register-d.webp",
      srcM: "/assets/auth/fighter-register-m.webp",
      widthM: 708,
      heightM: 676,
      widthD: 1082,
      heightD: 1418,
    },
    logo: {
      srcD: "/assets/auth/logo-register-d.webp",
      srcM: "/assets/auth/logo-register-m.webp",
      widthM: 512,
      heightM: 280,
      widthD: 430,
      heightD: 248,
    },
    title: {
      srcD: "/assets/auth/title-register-d.webp",
      srcM: "/assets/auth/title-register-m.webp",
      alt: "Stwórz swoją legendę",
      widthM: 1120,
      heightM: 188,
      widthD: 928,
      heightD: 170,
    },
    reward: {
      srcD: "/assets/auth/reward-d.webp",
      srcM: "/assets/auth/reward-m.webp",
      alt: "Na start: 60 Złotych Zębów",
      widthM: 1208,
      heightM: 208,
      widthD: 792,
      heightD: 136,
    },
  },
} as const;

type AuthSwitch = {
  question: string;
  link: { href: string; label: string };
  mobile: "inline" | "split";
  desktop: "inline" | "split";
};

const SWITCH: Record<AuthView, AuthSwitch> = {
  login: {
    question: "Nie masz konta?",
    link: { href: "/register", label: "Załóż konto" },
    mobile: "split",
    desktop: "inline",
  },
  register: {
    question: "Masz już konto?",
    link: { href: "/login", label: "Zaloguj się" },
    mobile: "inline",
    desktop: "split",
  },
};

type SwitchLinesProps = {
  content: AuthSwitch;
  layout: AuthSwitch["mobile"];
  lineClasses: readonly string[];
  gapClass: string;
};

function SwitchLines({ content, layout, lineClasses, gapClass }: SwitchLinesProps) {
  const link = <Link href={content.link.href}>{content.link.label}</Link>;

  if (layout === "inline") {
    return (
      <p className={lineClasses[0]}>
        <span>{content.question}</span>
        <span className={gapClass}> </span>
        {link}
      </p>
    );
  }

  return (
    <>
      <p className={lineClasses[0]}>
        <span>{content.question}</span>
      </p>
      <p className={lineClasses[1]}>{link}</p>
    </>
  );
}

type AuthLayoutProps = {
  view: AuthView;
  children: ReactNode;
};

export function AuthLayout({ view, children }: AuthLayoutProps) {
  const assets = ASSETS[view];
  const styles = AUTH_VIEW[view];
  const switchContent = SWITCH[view];

  return (
    <div className={AUTH_ROOT}>
      <div className={AUTH_SCENE}>
        <div className={`${AUTH_STAGE} ${styles.stage}`}>
          <div className={`${AUTH_BACKDROP} ${styles.backdrop}`} aria-hidden="true" />
          <ArtPicture
            className={`${AUTH_FIGHTER} ${styles.fighter}`}
            srcD={assets.fighter.srcD}
            srcM={assets.fighter.srcM}
            alt=""
            widthM={assets.fighter.widthM}
            heightM={assets.fighter.heightM}
            widthD={assets.fighter.widthD}
            heightD={assets.fighter.heightD}
            loading="eager"
            fetchPriority="high"
          />
          <Link className={`${AUTH_LOGO} ${styles.logo}`} href="/">
            <ArtPicture
              className={AUTH_LOGO_PICTURE}
              srcD={assets.logo.srcD}
              srcM={assets.logo.srcM}
              alt="FREAK LEGENDS – strona główna"
              widthM={assets.logo.widthM}
              heightM={assets.logo.heightM}
              widthD={assets.logo.widthD}
              heightD={assets.logo.heightD}
              loading="eager"
            />
          </Link>
          <main className={`${AUTH_PANEL} ${styles.panel}`}>
            <h1 className={`${AUTH_ART} ${styles.title}`}>
              <ArtPicture
                srcD={assets.title.srcD}
                srcM={assets.title.srcM}
                alt={assets.title.alt}
                widthM={assets.title.widthM}
                heightM={assets.title.heightM}
                widthD={assets.title.widthD}
                heightD={assets.title.heightD}
                loading="eager"
              />
            </h1>
            {view === "register" ? (
              <p className={`${AUTH_ART} ${styles.reward}`}>
                <ArtPicture
                  srcD={ASSETS.register.reward.srcD}
                  srcM={ASSETS.register.reward.srcM}
                  alt={ASSETS.register.reward.alt}
                  widthM={ASSETS.register.reward.widthM}
                  heightM={ASSETS.register.reward.heightM}
                  widthD={ASSETS.register.reward.widthD}
                  heightD={ASSETS.register.reward.heightD}
                />
              </p>
            ) : null}
            {children}
            <div className={`${AUTH_SWITCH} hidden desk:block`}>
              <SwitchLines
                content={switchContent}
                layout={switchContent.desktop}
                lineClasses={styles.switchDesktop}
                gapClass={styles.switchGap}
              />
            </div>
            <div className={`${AUTH_SWITCH} desk:hidden`}>
              <SwitchLines
                content={switchContent}
                layout={switchContent.mobile}
                lineClasses={styles.switchMobile}
                gapClass={styles.switchGap}
              />
            </div>
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
