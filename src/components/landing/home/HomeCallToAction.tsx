import Link from "next/link";

const SECTION = [
  "phone:relative phone:mt-40 phone:px-39 phone:pt-34 phone:pb-40 phone:text-center",
  "phone:bg-[linear-gradient(90deg,rgba(80,0,0,0),rgba(120,10,6,.35)_30%,rgba(120,10,6,.35)_70%,rgba(80,0,0,0))]",
  "phone:before:absolute phone:before:inset-x-0 phone:before:top-0 phone:before:h-3 phone:before:content-['']",
  "phone:before:bg-[linear-gradient(90deg,rgba(224,52,42,0),#e0342a_20%,#ff5a40_50%,#e0342a_80%,rgba(224,52,42,0))]",
  "phone:before:shadow-[0_0_calc(12*var(--k))_calc(2*var(--k))_rgba(224,52,42,.55)]",
  "phone:after:absolute phone:after:inset-x-0 phone:after:bottom-0 phone:after:h-3 phone:after:content-['']",
  "phone:after:bg-[linear-gradient(90deg,rgba(224,52,42,0),#e0342a_20%,#ff5a40_50%,#e0342a_80%,rgba(224,52,42,0))]",
  "phone:after:shadow-[0_0_calc(12*var(--k))_calc(2*var(--k))_rgba(224,52,42,.55)]",
  "desk:mt-56 desk:flex desk:items-center desk:justify-center desk:gap-48 desk:px-48 desk:py-36 desk:text-left",
].join(" ");

export function HomeCallToAction() {
  return (
    <section className={SECTION} aria-labelledby="cta-h">
      <h2
        id="cta-h"
        className="phone:font-cond phone:text-[calc(36*var(--k))] phone:leading-[1.05] phone:font-bold phone:tracking-[.01em] phone:text-[#efe6da] phone:uppercase desk:flex-none desk:text-[calc(42*var(--k))]"
      >
        Gotowy na pierwszą galę?
      </h2>
      <Link
        className="fl-btn phone:mx-auto phone:mt-24 phone:h-64 phone:w-428 phone:[--fs:32] desk:m-0 desk:h-66 desk:w-360 desk:tracking-[.04em] desk:[--fs:30]"
        href="/register"
      >
        <span>Zagraj za darmo</span>
      </Link>
    </section>
  );
}
