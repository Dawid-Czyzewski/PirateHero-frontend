import { HeroBackdrop, HeroForegroundEmbers } from "@/components/landing/home/HeroBackdrop";
import { HeroCopy } from "@/components/landing/home/HeroCopy";
import { HeroStage } from "@/components/landing/home/HeroStage";

const HERO = [
  "phone:relative phone:mx-auto phone:flex phone:w-720 phone:flex-col phone:items-center phone:overflow-x-clip phone:pb-8",
  "desk:[--hk:clamp(1px,min(100vw/1440,100vh/860),1.75px)] desk:[--k:var(--hk)] desk:[--spacing:var(--hk)]",
  "desk:relative desk:z-1 desk:mx-auto desk:grid desk:w-[min(calc(100%-2*var(--pad)),2200px)] desk:min-h-[min(calc(100dvh-var(--head)),66vw)]",
  "desk:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] desk:items-center desk:gap-x-24 desk:overflow-x-clip desk:overflow-y-visible desk:p-0",
  "desk:min-[1600px]:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] desk:max-[1199px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
].join(" ");

export function HeroSection() {
  return (
    <section className={HERO} aria-labelledby="hero-h">
      <HeroBackdrop />
      <HeroStage />
      <HeroForegroundEmbers />
      <HeroCopy />
    </section>
  );
}
