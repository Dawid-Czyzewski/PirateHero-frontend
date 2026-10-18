import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { PageFrame } from "./PageFrame";
import { SiteNav } from "./SiteNav";
import { SkewButton } from "./SkewButton";

export function SiteHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent">
      <PageFrame className="pointer-events-auto grid h-[5rem] grid-cols-[auto_1fr_auto] items-center gap-2 sm:h-[5.5rem] lg:gap-3 xl:gap-4">
        <Logo />
        <SiteNav />
        <div className="hidden h-10 shrink-0 items-center gap-2 lg:flex xl:gap-3">
          <SkewButton href="/login" variant="outline">
            Zaloguj się
          </SkewButton>
          <SkewButton href="/register">Zarejestruj się</SkewButton>
        </div>
        <MobileMenu />
      </PageFrame>
    </header>
  );
}
