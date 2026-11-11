import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export type SitePage = "index" | "ogrze" | "kontakt" | "legal";

type SiteShellProps = {
  page: SitePage;
  mainClassName?: string;
  children: ReactNode;
};

export const SITE_COLUMN =
  "relative z-1 mx-auto w-720 desk:w-[min(calc(100%-2*var(--pad)),calc(1320*var(--k)))]";

const ROOT = [
  "relative flex min-h-screen flex-col overflow-x-clip bg-[#070404] font-cond font-medium tracking-[-0.01em] text-[#f2efea] antialiased",
  "[--k:calc(min(100vw,560px)/720)] [--h:var(--k)] [--W:720] [--H:1280] [--ext:1.5] [--spacing:var(--k)]",
  "desk:min-h-dvh desk:[--k:clamp(1px,calc(100vw/1440),1.1px)] desk:[--pad:clamp(24px,4vw,120px)] desk:[--head:calc(72*var(--k))]",
  "[&_img]:max-w-none",
  "[&_:where(a,button,input,select,textarea):focus-visible]:rounded [&_:where(a,button,input,select,textarea):focus-visible]:outline-3",
  "[&_:where(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:where(a,button,input,select,textarea):focus-visible]:outline-gold",
].join(" ");

const SKIP_LINK =
  "absolute -top-15 left-2 z-50 rounded-md bg-gold px-4 py-3.5 font-cond text-base leading-none font-semibold text-[#140c04] no-underline [--spacing:0.25rem] focus:top-2";

const BACKDROP_BASE =
  "pointer-events-none absolute inset-x-0 top-0 z-0 h-1280 desk:fixed desk:inset-0 desk:h-auto";

const ARENA_DESK =
  "desk:[background:radial-gradient(ellipse_75%_70%_at_50%_38%,rgba(7,4,4,0)_0%,rgba(7,4,4,.45)_65%,rgba(7,4,4,.9)_100%),linear-gradient(rgba(7,4,4,.15),rgba(7,4,4,.55)_70%,rgba(7,4,4,.85)),url(/assets/site/bg-arena-d.webp)_center_35%_/_cover_no-repeat]";

const BACKDROP: Record<SitePage, string> = {
  index: [
    "[background:linear-gradient(rgba(7,4,4,.25),rgba(7,4,4,0)_25%,rgba(7,4,4,0)_55%,#070404_92%),url(/assets/fl/backgrounds/bg-mobile.webp)_center_calc(-170*var(--k))_/_100%_auto_no-repeat]",
    "desk:[background:radial-gradient(ellipse_80%_75%_at_50%_40%,rgba(7,4,4,0)_0%,rgba(7,4,4,.28)_62%,rgba(7,4,4,.82)_100%),linear-gradient(rgba(7,4,4,.05),rgba(7,4,4,.22)_65%,rgba(7,4,4,.72)),url(/assets/site/bg-arena-hero-d.webp)_center_35%_/_cover_no-repeat]",
  ].join(" "),
  ogrze: `[background:url(/assets/site/bg-ogrze-m.webp)_center_top_/_calc(1080*var(--k))_100%_no-repeat] ${ARENA_DESK}`,
  kontakt: `[background:url(/assets/site/bg-kontakt-m.webp)_center_top_/_calc(1080*var(--k))_100%_no-repeat] ${ARENA_DESK}`,
  legal: [
    "[background:linear-gradient(rgba(7,4,4,.35),rgba(7,4,4,.25)_18%,rgba(7,4,4,.75)_40%,#070404_62%),url(/assets/fl/backgrounds/bg-mobile.webp)_center_calc(-170*var(--k))_/_100%_auto_no-repeat]",
    "desk:[background:radial-gradient(ellipse_75%_70%_at_50%_38%,rgba(7,4,4,.2)_0%,rgba(7,4,4,.6)_65%,rgba(7,4,4,.94)_100%),linear-gradient(rgba(7,4,4,.35),rgba(7,4,4,.72)_55%,rgba(7,4,4,.9)),url(/assets/site/bg-arena-d.webp)_center_35%_/_cover_no-repeat]",
  ].join(" "),
};

const MAIN_BASE = "relative z-1 flex-[1_0_auto] pb-40";

const MAIN_DEFAULT: Record<SitePage, string> = {
  index: `${MAIN_BASE} desk:pb-64`,
  ogrze: `${MAIN_BASE} desk:pb-72 ${SITE_COLUMN}`,
  kontakt: `${MAIN_BASE} desk:pb-72 ${SITE_COLUMN}`,
  legal: `${MAIN_BASE} desk:pb-72 ${SITE_COLUMN}`,
};

export function SiteShell({ page, mainClassName, children }: SiteShellProps) {
  return (
    <div className={`${ROOT} p-${page}`}>
      <a className={SKIP_LINK} href="#main">
        Przejdź do treści
      </a>
      <div className={`${BACKDROP_BASE} ${BACKDROP[page]}`} aria-hidden="true" />
      <SiteHeader wide={page === "index"} />
      <main id="main" className={mainClassName ?? MAIN_DEFAULT[page]}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
