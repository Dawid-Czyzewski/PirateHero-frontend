import { FeatureCards } from "@/components/landing/home/FeatureCards";

const SCROLL_HINT = [
  "z-3 grid place-items-center text-[#e9dcc8] opacity-85 animate-chev hover:text-gold hover:opacity-100 motion-reduce:animate-none",
  "phone:mx-auto phone:mt-4 phone:mb-10 phone:h-[max(calc(44*var(--k)),44px)] phone:w-[max(calc(60*var(--k)),44px)]",
  "desk:relative desk:z-4 desk:mx-auto desk:mt-8 desk:mb-18 desk:h-44 desk:w-48",
].join(" ");

export function AboutSection() {
  return (
    <section
      className="phone:relative phone:mr-39 phone:ml-40 desk:relative desk:isolate desk:-mt-48 desk:px-48 desk:pt-76 desk:pb-52"
      id="about"
      aria-labelledby="about-h"
    >
      <div className="fl-panel phone:h-auto phone:min-h-127 phone:px-20 phone:pt-[calc(56.3*var(--k))] phone:pb-20 desk:static desk:h-auto desk:p-0">
        <h2 className="fl-plate phone:top-3 phone:h-48 phone:w-300 phone:[--fs:28]" id="about-h">
          Czym jest gra?
        </h2>
        <a className={SCROLL_HINT} href="#features" aria-label="Przewiń do opisu gry">
          <svg className="phone:h-20 phone:w-34 desk:h-18 desk:w-30" viewBox="0 0 40 24" aria-hidden="true">
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
        <p className="text-center font-medium phone:text-[calc(21*var(--k))] phone:leading-26 desk:mx-auto desk:max-w-820 desk:text-[calc(22*var(--k))] desk:leading-[1.4]">
          Odkryj mroczny świat fikcyjnych freak fightów.
          <br /> Trenuj, walcz i&nbsp;zostań największą legendą oktagonu.
        </p>
      </div>
      <FeatureCards />
    </section>
  );
}
