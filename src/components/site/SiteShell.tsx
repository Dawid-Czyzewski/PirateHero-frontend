import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

type SiteShellProps = {
  page: "index" | "ogrze" | "kontakt" | "legal";
  mainClass?: string;
  children: ReactNode;
};

export function SiteShell({ page, mainClass, children }: SiteShellProps) {
  const resolvedMain =
    mainClass ?? (page === "index" ? "main-wide" : "col");

  return (
    <div className={`site p-${page}`}>
      <a className="skip" href="#main">
        Przejdź do treści
      </a>
      <div className="site__bg" aria-hidden="true" />
      <SiteHeader />
      <main id="main" className={resolvedMain}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
