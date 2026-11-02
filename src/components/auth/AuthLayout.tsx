import Link from "next/link";
import type { ReactNode } from "react";
import { ArtPicture } from "@/components/site/ArtPicture";
import { SiteFooter } from "@/components/site/SiteFooter";

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

type AuthLayoutProps = {
  view: "login" | "register";
  children: ReactNode;
  switchDesktop: ReactNode;
  switchMobile: ReactNode;
};

export function AuthLayout({
  view,
  children,
  switchDesktop,
  switchMobile,
}: AuthLayoutProps) {
  const assets = ASSETS[view];

  return (
    <div className={`page-${view}`}>
      <div className="auth">
        <div className="auth__scene">
          <div className="auth__stage">
            <div className="auth__bg" aria-hidden="true" />
            <ArtPicture
              className="auth__fighter"
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
            <Link className="auth__logo" href="/">
              <ArtPicture
                className="auth__logo-pic"
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
            <main className="auth__panel">
              <h1 className="auth__title">
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
                <p className="auth__reward">
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
              <div className="auth__switch auth__switch--d">{switchDesktop}</div>
              <div className="auth__switch auth__switch--m">{switchMobile}</div>
            </main>
          </div>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}
