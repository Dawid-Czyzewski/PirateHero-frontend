export const LEGAL_MAIN = [
  "relative z-1 mx-auto w-720 flex-[1_0_auto] [--ts:calc(.37*var(--k))] phone:pb-60",
  "desk:w-[min(calc(100%-2*var(--pad)),calc(1100*var(--k)))] desk:pb-64 desk:[--ts:calc(.24*var(--k))]",
].join(" ");

export const PLACEHOLDER = "rounded-[3px] bg-gold/9 px-[.12em] text-gold box-decoration-clone";

export const SECTION = [
  "fl-panel grid grid-cols-[auto_minmax(0,1fr)] items-center",
  "phone:scroll-mt-[16px] phone:gap-x-22 phone:gap-y-20 phone:px-44 phone:py-46 phone:text-[calc(34*var(--k))]",
  "desk:scroll-mt-[calc(var(--head)+20*var(--k))] desk:grid-cols-[calc(56*var(--k))_minmax(0,1fr)] desk:gap-x-22 desk:gap-y-8",
  "desk:pt-38 desk:pr-50 desk:pb-40 desk:pl-40 desk:text-[calc(27*var(--k))]",
].join(" ");

export const SECTION_NUMBER = [
  "grid place-items-center rounded-full font-cond text-[1em] leading-none font-bold text-gold",
  "bg-[radial-gradient(circle_at_50%_35%,#2a1c12,#120a07_70%)]",
  "shadow-[inset_0_0_0_.09em_#c99a3e,inset_0_0_0_.14em_#4a3216,0_0_12px_rgba(240,195,90,.25),0_2px_4px_rgba(0,0,0,.7)]",
  "phone:size-66 phone:text-[calc(38*var(--k))] desk:-mt-6 desk:size-52 desk:self-start desk:text-[calc(30*var(--k))]",
].join(" ");

export const SECTION_HEADING = "font-cond text-[1em] leading-[1.15] font-bold tracking-[.005em] text-[#f6efe4]";

const BODY_TEXT = [
  "col-span-full min-w-0 font-semi font-normal tracking-normal text-[#ddd5ca] leading-[1.55]",
  "phone:text-[max(16px,calc(27*var(--k)))] desk:text-[clamp(16px,calc(18*var(--k)),20px)] desk:leading-[1.6]",
  "[&>*+*]:mt-[.75em] [&_sup]:leading-[0]",
  "[&_strong]:font-semibold [&_strong]:text-[#f6efe4]",
  "[&_a]:text-gold [&_a]:underline-offset-[.16em] [&_a:hover]:text-gold-light",
  "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[.4em]",
  "[&_li]:relative [&_li]:pl-[1.15em] [&_li]:before:absolute [&_li]:before:top-[.62em] [&_li]:before:left-[.2em] [&_li]:before:size-[.36em]",
  "[&_li]:before:rounded-full [&_li]:before:bg-gold [&_li]:before:shadow-[0_0_0_2px_rgba(240,195,90,.18)] [&_li]:before:content-['']",
  "[&_.ph]:rounded-[3px] [&_.ph]:bg-gold/9 [&_.ph]:px-[.12em] [&_.ph]:text-gold [&_.ph]:box-decoration-clone",
].join(" ");

const BODY_TABLE = [
  "[&_.ltable-wrap]:max-w-full [&_.ltable-wrap:focus-visible]:outline-3 [&_.ltable-wrap:focus-visible]:outline-offset-3 [&_.ltable-wrap:focus-visible]:outline-gold",
  "[&_.ltable]:w-full [&_.ltable]:border-collapse [&_.ltable]:text-left [&_.ltable_th]:align-top [&_.ltable_td]:align-top",
  "phone:[&_.ltable]:block phone:[&_.ltable_tbody]:block phone:[&_.ltable_tr]:block phone:[&_.ltable_th]:block",
  "phone:[&_.ltable_thead]:absolute phone:[&_.ltable_thead]:h-px phone:[&_.ltable_thead]:w-px phone:[&_.ltable_thead]:overflow-hidden phone:[&_.ltable_thead]:[clip-path:inset(50%)]",
  "phone:[&_.ltable_tr]:rounded-[8px] phone:[&_.ltable_tr]:border phone:[&_.ltable_tr]:border-gold/24 phone:[&_.ltable_tr]:bg-white/[.035]",
  "phone:[&_.ltable_tr]:px-[16px] phone:[&_.ltable_tr]:pt-[14px] phone:[&_.ltable_tr]:pb-[10px] phone:[&_.ltable_tr+tr]:mt-[12px]",
  "phone:[&_.ltable_tbody_th]:mb-[4px] phone:[&_.ltable_tbody_th]:border-b phone:[&_.ltable_tbody_th]:border-gold/18 phone:[&_.ltable_tbody_th]:pb-[8px]",
  "phone:[&_.ltable_tbody_th]:font-cond phone:[&_.ltable_tbody_th]:text-[1.2em] phone:[&_.ltable_tbody_th]:leading-[1.2] phone:[&_.ltable_tbody_th]:font-bold phone:[&_.ltable_tbody_th]:text-[#f6efe4]",
  "phone:[&_.ltable_td]:grid phone:[&_.ltable_td]:grid-cols-[minmax(6.2em,30%)_minmax(0,1fr)] phone:[&_.ltable_td]:gap-[12px] phone:[&_.ltable_td]:py-[6px]",
  "phone:[&_.ltable_td]:text-[.95em] phone:[&_.ltable_td]:leading-[1.45]",
  "phone:[&_.ltable_td]:before:font-cond phone:[&_.ltable_td]:before:text-[.88em] phone:[&_.ltable_td]:before:leading-[1.6] phone:[&_.ltable_td]:before:font-semibold",
  "phone:[&_.ltable_td]:before:tracking-[.04em] phone:[&_.ltable_td]:before:text-gold phone:[&_.ltable_td]:before:uppercase phone:[&_.ltable_td]:before:content-[attr(data-label)]",
  "desk:[&_.ltable-wrap]:overflow-x-auto desk:[&_.ltable-wrap]:rounded-[6px] desk:[&_.ltable-wrap]:border desk:[&_.ltable-wrap]:border-gold/22 desk:[&_.ltable-wrap]:bg-black/25",
  "desk:[&_.ltable]:text-[.9em] desk:[&_.ltable]:leading-[1.45]",
  "desk:[&_.ltable_thead_th]:border-b desk:[&_.ltable_thead_th]:border-gold/30 desk:[&_.ltable_thead_th]:bg-gold/8 desk:[&_.ltable_thead_th]:px-[14px] desk:[&_.ltable_thead_th]:py-[12px]",
  "desk:[&_.ltable_thead_th]:font-cond desk:[&_.ltable_thead_th]:text-[.92em] desk:[&_.ltable_thead_th]:leading-[1.2] desk:[&_.ltable_thead_th]:font-semibold",
  "desk:[&_.ltable_thead_th]:tracking-[.05em] desk:[&_.ltable_thead_th]:whitespace-nowrap desk:[&_.ltable_thead_th]:text-gold desk:[&_.ltable_thead_th]:uppercase",
  "desk:[&_.ltable_tbody_th]:border-b desk:[&_.ltable_tbody_th]:border-white/7 desk:[&_.ltable_tbody_th]:px-[14px] desk:[&_.ltable_tbody_th]:py-[12px]",
  "desk:[&_.ltable_tbody_th]:font-cond desk:[&_.ltable_tbody_th]:text-[1.08em] desk:[&_.ltable_tbody_th]:leading-[1.3] desk:[&_.ltable_tbody_th]:font-bold",
  "desk:[&_.ltable_tbody_th]:whitespace-nowrap desk:[&_.ltable_tbody_th]:text-[#f6efe4]",
  "desk:[&_.ltable_td]:border-b desk:[&_.ltable_td]:border-white/7 desk:[&_.ltable_td]:px-[14px] desk:[&_.ltable_td]:py-[12px]",
  "desk:[&_.ltable_tbody_tr:last-child>*]:border-b-0 desk:[&_.ltable_tbody_tr:hover>*]:bg-white/[.025]",
  "desk:[&_.ltable--list_tbody_th]:min-w-[9em] desk:[&_.ltable--list_tbody_th]:whitespace-normal desk:[&_.ltable--list_td:nth-child(4)]:w-[30%]",
  "desk:[&_.ltable--cat_.ph]:whitespace-nowrap desk:[&_.ltable--cat_td:last-child]:min-w-[8em] desk:[&_.ltable--cat_td:nth-child(2)]:w-[36%]",
].join(" ");

const BODY_BASE = `${BODY_TEXT} ${BODY_TABLE}`;

export const SECTION_BODY = {
  prose: `${BODY_BASE} desk:col-start-2 desk:max-w-[30.5em]`,
  table: `${BODY_BASE} desk:mt-10 desk:max-w-none desk:[&>:not(.ltable-wrap)]:max-w-[30.5em]`,
} as const;

export const SECTION_NUMBER_ROW = {
  prose: "desk:row-[1/span_2]",
  table: "desk:row-start-1",
} as const;

export const CONSENT_CONTROLS = [
  "col-span-full font-semi phone:mt-[calc(1.1em-20*var(--k))] phone:text-[max(16px,calc(27*var(--k)))]",
  "desk:col-start-2 desk:mt-[calc(1.1em-8*var(--k))] desk:text-[clamp(16px,calc(18*var(--k)),20px)]",
].join(" ");
