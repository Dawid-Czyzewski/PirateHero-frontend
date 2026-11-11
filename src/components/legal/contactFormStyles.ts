export const FIELD_GAP = "mt-18";

export const LABEL =
  "mb-10 block font-cond text-[calc(27*var(--k))] leading-none font-semibold text-[#f6f6f6] desk:mb-8 desk:pl-1 desk:text-[calc(20*var(--k))]";

export const TOPIC_LABEL = `${LABEL} phone:sr-only desk:not-sr-only desk:mb-8`;

const CONTROL = [
  "block w-full appearance-none rounded-[calc(4*var(--k))] border-0 bg-[#121111] font-cond font-medium text-[#f4f1ec] outline-offset-2",
  "shadow-[inset_0_0_0_calc(2*var(--k))_#2b2826,inset_0_calc(2*var(--k))_calc(6*var(--k))_rgba(0,0,0,.6)]",
  "aria-[invalid=true]:shadow-[inset_0_0_0_calc(2*var(--k))_#ff6b5e] placeholder:text-[#8f8a84]",
  "text-[max(16px,calc(24*var(--k)))] desk:text-[max(16px,calc(19*var(--k)))]",
].join(" ");

export const INPUT = `${CONTROL} h-[max(calc(50*var(--k)),44px)] px-16 leading-[1.2] desk:h-50 desk:px-14`;

export const SELECT = `${CONTROL} h-[max(calc(50*var(--k)),44px)] cursor-pointer pr-50 pl-95 leading-[1.2] desk:h-50 desk:pl-14 [&_option]:bg-[#121111] [&_option]:text-[#f4f1ec]`;

export const TEXTAREA = `${CONTROL} h-108 min-h-80 resize-y px-16 py-12 leading-[1.3] desk:h-150 desk:min-h-90 desk:px-14 desk:py-12`;

export const SELECT_WRAP = [
  "relative",
  "after:pointer-events-none after:absolute after:top-1/2 after:right-18 after:-mt-5 after:content-['']",
  "after:border-[calc(9*var(--k))] after:border-b-0 after:border-transparent after:border-t-[calc(11*var(--k))] after:border-t-[#f4f1ec]",
  "desk:after:right-16 desk:after:border-[calc(7*var(--k))] desk:after:border-b-0 desk:after:border-t-[calc(8*var(--k))]",
].join(" ");

export const SELECT_PREFIX =
  "pointer-events-none absolute inset-y-0 left-16 flex items-center font-cond text-[max(16px,calc(24*var(--k)))] leading-none font-medium text-[#f4f1ec] desk:hidden";

const ERROR_BASE = [
  "mt-6 flex items-start gap-[6px] font-cond text-[calc(20*var(--k))] leading-[1.25] font-medium text-[#ff6b5e] empty:hidden",
  "before:mt-[.12em] before:grid before:size-[1.05em] before:flex-none before:place-items-center before:rounded-full before:bg-[#ff6b5e]",
  "before:text-[.85em] before:font-bold before:text-[#1a0606] before:content-['!']",
  "desk:absolute desk:m-0 desk:block desk:truncate desk:text-[calc(16*var(--k))] desk:leading-20 desk:empty:hidden",
  "desk:before:mr-[5px] desk:before:inline-grid desk:before:align-[-.1em]",
].join(" ");

export const ERROR = `${ERROR_BASE} desk:top-0 desk:right-0 desk:max-w-[68%]`;

export const CONSENT_ERROR = `${ERROR_BASE} desk:-bottom-24 desk:left-32 desk:max-w-none`;

export const CHECK = [
  "flex cursor-pointer items-start gap-18 font-cond text-[calc(24*var(--k))] leading-29 font-medium text-[#ece8e2]",
  "phone:-mb-[8px] phone:mt-[calc(4*var(--k)-8px)] phone:py-[8px]",
  "desk:gap-12 desk:text-[calc(18*var(--k))] desk:leading-[1.35]",
].join(" ");

export const CHECK_BOX = [
  "mt-2 grid size-24 flex-none place-items-center rounded-[calc(3*var(--k))] bg-[#0e0d0d] text-[#14100a] shadow-[inset_0_0_0_calc(2*var(--k))_#77706a]",
  "peer-checked:bg-gold peer-checked:shadow-none peer-checked:[&_svg]:opacity-100",
  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold",
  "desk:mt-1 desk:size-20",
].join(" ");

export const SUBMIT = "fl-btn fl-btn-red mt-18 h-76 w-full tracking-[.05em] [--fs:38] desk:mt-34 desk:h-66 desk:tracking-[.08em] desk:[--fs:30]";

export const SPINNER =
  "mr-[.4em] inline-block size-[.8em] animate-[spin_.8s_linear_infinite] rounded-full border-3 border-white/40 border-t-white";

export const STATUS =
  "mt-12 text-center font-cond text-[calc(22*var(--k))] leading-[1.3] font-semibold empty:hidden desk:text-[calc(17*var(--k))]";

export const DONE = "py-20 text-center desk:py-80";
