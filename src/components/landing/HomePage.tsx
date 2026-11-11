import { AboutSection } from "@/components/landing/home/AboutSection";
import { HeroSection } from "@/components/landing/home/HeroSection";
import { HomeCallToAction } from "@/components/landing/home/HomeCallToAction";
import { SITE_COLUMN, SiteShell } from "@/components/site/SiteShell";

export function HomePage() {
  return (
    <SiteShell page="index">
      <HeroSection />
      <div className={`${SITE_COLUMN} desk:z-2`}>
        <AboutSection />
        <HomeCallToAction />
      </div>
    </SiteShell>
  );
}
