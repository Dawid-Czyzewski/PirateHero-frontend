export type AuthView = "login" | "register";

export const AUTH_ROOT = [
  "flex min-h-screen flex-col bg-[#050303] font-cond text-[#f6f4f1] antialiased [text-rendering:optimizeLegibility] [&_img]:max-w-none",
  "[--k:calc(min(100vw,560px)/720)] [--spacing:var(--k)] desk:[--k:max(.5px,min(calc(100vw/1280),calc((100vh-var(--foot-h))/720)))]",
  "[&_:where(a,button,input):focus-visible]:rounded [&_:where(a,button,input):focus-visible]:outline-3",
  "[&_:where(a,button,input):focus-visible]:outline-offset-3 [&_:where(a,button,input):focus-visible]:outline-gold",
].join(" ");

export const AUTH_SCENE =
  "relative flex-[1_0_auto] overflow-clip bg-[#060404] desk:flex desk:min-h-[calc(100vh-var(--foot-h))] desk:items-stretch desk:justify-center";

export const AUTH_STAGE = [
  "relative mx-auto flow-root min-h-1280 w-720",
  "desk:m-0 desk:min-h-[calc(100vh-var(--foot-h))] desk:w-1280 desk:flex-none desk:[--E:max(0px,calc(100vh-var(--foot-h)-720*var(--k)))]",
].join(" ");

export const AUTH_BACKDROP =
  "pointer-events-none absolute top-0 -left-180 z-0 h-1900 w-1080 bg-no-repeat [background-position:0_0] [background-size:100%_100%] desk:top-auto desk:block";

export const AUTH_FIGHTER = "pointer-events-none absolute z-1 [&_img]:h-full [&_img]:w-full";

export const AUTH_LOGO = "absolute z-2 block";

export const AUTH_LOGO_PICTURE = "block h-full w-full [&_img]:h-full [&_img]:w-full";

export const AUTH_PANEL = [
  "relative z-3 flex flex-col items-start",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:border-[calc(64*var(--k))] before:border-transparent before:content-['']",
  "before:[border-image:url(/assets/auth/frame-m.webp)_128_fill_/_calc(64*var(--k))_stretch]",
  "desk:before:border-[calc(56*var(--k))] desk:before:[border-image:url(/assets/auth/frame-d.webp)_112_fill_/_calc(56*var(--k))_stretch]",
].join(" ");

export const AUTH_ART = "absolute m-0 [&_img]:h-full [&_img]:w-full [&_picture]:block [&_picture]:h-full [&_picture]:w-full";

export const AUTH_FORM = "flex flex-none flex-col";

export const AUTH_FIELD_LABEL = "sr-only desk:not-sr-only desk:block desk:whitespace-nowrap desk:text-[#f6f6f6]";

export const AUTH_INPUT = [
  "m-0 block w-full appearance-none border-0 text-[#f6f4f1] [font-family:inherit] outline-none transition-shadow duration-150",
  "shadow-[inset_0_0_0_var(--in-b,1px)_var(--in-bc,#333)] placeholder:opacity-100 desk:placeholder:text-transparent",
  "focus-visible:rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
  "data-[state=valid]:[--in-bc:rgba(120,200,120,.55)] desk:data-[state=valid]:[--in-bc:rgba(120,200,120,.55)]",
  "aria-[invalid=true]:shadow-[inset_0_0_0_max(1.5px,calc(2*var(--k)))_#e0342a]",
  "[&:-webkit-autofill]:caret-[#f6f4f1] [&:-webkit-autofill]:[-webkit-text-fill-color:#f6f4f1]",
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_var(--in-b,1px)_var(--in-bc,#333),inset_0_0_0_100px_#151515]",
].join(" ");

export const AUTH_EYE =
  "absolute inset-y-0 right-0 m-0 box-content flex cursor-pointer items-center justify-end border-0 bg-transparent text-[#c9c9cb] hover:text-white [&_svg]:block [&_svg]:flex-none";

const ERROR_CORE = [
  "m-0 flex items-start gap-[.45em] text-left font-semi leading-[1.25] font-medium tracking-[.01em] text-[#ff6b5e] empty:hidden",
  "before:mt-[.1em] before:grid before:size-[1.15em] before:flex-none before:place-items-center before:rounded-full before:bg-fire",
  "before:text-[.85em] before:font-bold before:text-white before:content-['!']",
  "desk:absolute desk:right-0 desk:!m-0 desk:items-center desk:justify-end desk:overflow-hidden desk:text-right desk:text-ellipsis desk:empty:hidden desk:before:mt-0",
].join(" ");

export const AUTH_FIELD_ERROR = `${ERROR_CORE} desk:top-0 desk:max-w-[72%] desk:whitespace-nowrap`;

export const AUTH_ROW_ERROR = `${ERROR_CORE} basis-full desk:top-1/2 desk:max-w-[52%] desk:-translate-y-1/2 desk:basis-auto desk:leading-[1.05]`;

export const AUTH_ROW = "flex w-full flex-wrap items-center justify-between text-[#fbfbfb]";

export const AUTH_CHECK = "relative inline-flex cursor-pointer items-center select-none";

export const AUTH_CHECK_BOX = [
  "grid flex-none place-items-center border-solid border-[#8f8f8f] bg-black/25 transition-colors",
  "peer-checked:border-gold peer-checked:bg-gold peer-checked:[&_svg]:opacity-100",
  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-gold",
].join(" ");

export const AUTH_SMALL_LINK = "underline underline-offset-[.18em] [text-decoration-thickness:.075em] hover:brightness-115";

export const AUTH_SUBMIT = [
  "mr-0 mb-0 flex flex-none cursor-pointer items-center justify-center border-0 bg-transparent px-0 pb-0 leading-none",
  "bg-no-repeat [background-position:0_0] [background-size:100%_100%] transition-[filter,transform] [-webkit-tap-highlight-color:transparent]",
  "hover:[filter:brightness(1.08)_saturate(1.05)] active:translate-y-px active:brightness-[.94]",
  "disabled:cursor-progress disabled:[filter:saturate(.75)_brightness(.92)]",
].join(" ");

export const AUTH_SUBMIT_SKIN = {
  gold: "bg-[url(/assets/auth/btn-gold-m.webp)] desk:bg-[url(/assets/auth/btn-gold-d.webp)]",
  red: "bg-[url(/assets/auth/btn-red-m.webp)] desk:bg-[url(/assets/auth/btn-red-d.webp)]",
} as const;

export const AUTH_SPINNER =
  "mr-[.4em] inline-block size-[.55em] animate-[spin_.8s_linear_infinite] rounded-full border-[.11em] border-current border-r-transparent motion-reduce:animate-[spin_2.4s_linear_infinite]";

export const AUTH_STATUS =
  "mt-10 w-full text-center font-semi text-[max(13px,calc(24*var(--k)))] font-medium empty:hidden desk:sr-only";

export const AUTH_SWITCH = "w-full flex-none text-center text-[#f8f8f8] [&_a]:underline-offset-[.2em] [&_a]:[text-decoration-thickness:.075em] [&_a:hover]:brightness-[1.18] [&_p]:m-0 [&_p]:whitespace-nowrap";

export type AuthViewStyles = {
  stage: string;
  backdrop: string;
  fighter: string;
  logo: string;
  panel: string;
  title: string;
  reward: string;
  form: string;
  fieldGap: string;
  label: string;
  input: string;
  inputWithEye: string;
  eye: string;
  error: string;
  rowError: string;
  row: string;
  check: string;
  checkBox: string;
  smallLink: string;
  submit: string;
  switchGap: string;
  switchMobile: readonly string[];
  switchDesktop: readonly string[];
};

export const AUTH_VIEW: Record<AuthView, AuthViewStyles> = {
  login: {
    stage: "desk:[--fh:min(calc(699*var(--k)+var(--E)),calc(944*var(--k)))]",
    backdrop: [
      "[background-image:url(/assets/auth/bg-login-m.webp)] desk:[background-image:url(/assets/auth/bg-login-d.webp)]",
      "desk:bottom-[calc(var(--fh)*-100/699)] desk:left-[calc(398*var(--k)-var(--fh)*718/699)] desk:h-[calc(var(--fh)*920/699)] desk:w-[calc(var(--fh)*1920/699)]",
    ].join(" "),
    fighter: [
      "top-140 left-175 h-375 w-351",
      "desk:top-auto desk:bottom-0 desk:left-[calc(398*var(--k)-var(--fh)*291/699)] desk:h-(--fh) desk:w-[calc(var(--fh)*582/699)]",
    ].join(" "),
    logo: "top-13 left-200 h-167 w-309 desk:top-4 desk:left-9 desk:h-128 desk:w-225",
    panel: [
      "mt-491 ml-37 min-h-748 w-646 pt-217 pb-[calc(53.6*var(--k))] font-semi",
      "desk:mt-[calc(108*var(--k)+var(--E)/2)] desk:ml-678 desk:min-h-541 desk:w-549 desk:pt-[calc(91.25*var(--k))] desk:pb-[calc(45.3*var(--k))] desk:font-cond",
    ].join(" "),
    title: "top-17 left-113 h-196 w-425 desk:-top-10 desk:left-38 desk:h-77 desk:w-473",
    reward: "",
    form: "ml-53 w-538 desk:ml-60 desk:w-427",
    fieldGap: "mt-20 desk:mt-19",
    label: "desk:mb-[calc(4.5*var(--k))] desk:h-30 desk:text-[calc(25*var(--k))] desk:leading-30 desk:font-semibold desk:tracking-[.012em]",
    input: [
      "h-79 rounded-[calc(10*var(--k))] bg-[#0e0e0e] px-103 py-0 text-[max(16px,calc(30*var(--k)))] font-normal tracking-[.032em] [--in-b:calc(1*var(--k))] [--in-bc:#363636] placeholder:text-[#bdbcbc]",
      "desk:h-47 desk:rounded-[calc(5*var(--k))] desk:bg-[#111214] desk:px-14 desk:text-[max(16px,calc(22*var(--k)))] desk:font-medium desk:tracking-normal desk:[--in-b:calc(2*var(--k))] desk:[--in-bc:#242527]",
    ].join(" "),
    inputWithEye: "pr-92 desk:pr-[calc(57.5*var(--k))]",
    eye: [
      "pr-[calc(22.75*var(--k))] pl-25 [&_svg]:size-[calc(40.5*var(--k))] [&_svg]:translate-y-[calc(2.5*var(--k))]",
      "desk:pr-[calc(13.66*var(--k))] desk:pl-15 desk:[&_svg]:size-[calc(24.19*var(--k))] desk:[&_svg]:translate-y-0",
    ].join(" "),
    error: "mt-6 text-[calc(24*var(--k))] desk:h-30 desk:text-[calc(17*var(--k))]",
    rowError: "mt-6 text-[calc(24*var(--k))] desk:h-auto desk:text-[calc(15.5*var(--k))]",
    row: [
      "mt-[calc(24.7*var(--k))] min-h-36 text-[calc(25.7*var(--k))] leading-36 font-normal tracking-[.006em]",
      "desk:mt-[calc(19.65*var(--k))] desk:min-h-26 desk:text-[calc(21.4*var(--k))] desk:leading-26 desk:font-medium desk:tracking-[-.016em]",
    ].join(" "),
    check: "ml-4 desk:ml-0",
    checkBox: [
      "mr-26 size-36 rounded-[calc(5*var(--k))] border-[calc(2.5*var(--k))]",
      "desk:mr-[calc(12.5*var(--k))] desk:size-[calc(23.5*var(--k))] desk:rounded-[calc(3*var(--k))] desk:border-[calc(2*var(--k))]",
    ].join(" "),
    smallLink: "mr-12 font-medium tracking-[-.002em] text-[#eec16e] desk:mr-6 desk:tracking-[-.01em] desk:text-gold",
    submit: [
      "mt-[calc(28.3*var(--k))] -ml-6 h-113 w-552 pt-4 pl-0 font-cond text-[calc(61.4*var(--k))] font-semibold tracking-[-.038em] text-[#fff9f0]",
      "[text-shadow:0_0_2px_#3a2000,0_2px_0_#3a2000,0_3px_4px_rgba(0,0,0,.6)]",
      "desk:mt-[calc(24.6*var(--k))] desk:-ml-2 desk:h-87 desk:w-429 desk:pt-[calc(.4*var(--k))] desk:font-semi desk:text-[calc(48.6*var(--k))] desk:font-bold",
      "desk:tracking-[-.009em] desk:text-[#1b1206] desk:[text-shadow:0_1px_0_rgba(255,220,140,.45)]",
    ].join(" "),
    switchGap: "ml-[calc(28.4*var(--k))]",
    switchMobile: [
      "mt-[calc(15.85*var(--k))] h-38 translate-x-2 text-[calc(32.9*var(--k))] leading-38 font-normal tracking-[.044em]",
      "mt-[calc(7.55*var(--k))] h-36 translate-x-[calc(1.5*var(--k))] text-[calc(31.4*var(--k))] leading-36 font-medium tracking-[.02em] [&_a]:tracking-[.02em] [&_a]:text-[#c41e1c] [&_a]:underline",
    ],
    switchDesktop: [
      "mt-[calc(13.7*var(--k))] h-30 -translate-x-[calc(4.5*var(--k))] text-[calc(25.7*var(--k))] leading-30 font-medium tracking-[-.006em] [&_a]:tracking-[.013em] [&_a]:text-[#cb2e29] [&_a]:underline",
    ],
  },
  register: {
    stage: "desk:[--fh:min(calc(709*var(--k)+var(--E)),calc(957*var(--k)))]",
    backdrop: [
      "[background-image:url(/assets/auth/bg-register-m.webp)] desk:[background-image:url(/assets/auth/bg-register-d.webp)]",
      "desk:bottom-[calc(var(--fh)*-100/709)] desk:left-[calc(372.5*var(--k)-var(--fh)*692.5/709)] desk:h-[calc(var(--fh)*920/709)] desk:w-[calc(var(--fh)*1920/709)]",
    ].join(" "),
    fighter: [
      "top-109 left-180 h-338 w-354",
      "desk:top-auto desk:bottom-0 desk:left-[calc(372.5*var(--k)-var(--fh)*270.5/709)] desk:h-(--fh) desk:w-[calc(var(--fh)*541/709)]",
    ].join(" "),
    logo: "top-10 left-244 h-140 w-256 desk:top-4 desk:left-9 desk:h-124 desk:w-215",
    panel: [
      "mt-422 ml-35 min-h-802 w-650 pt-208 pb-[calc(41.6*var(--k))] font-cond",
      "desk:mt-[calc(43*var(--k)+var(--E)/2)] desk:ml-646 desk:min-h-642 desk:w-563 desk:pt-[calc(155.4*var(--k))] desk:pb-[calc(27.15*var(--k))]",
    ].join(" "),
    title: "top-10 left-45 h-94 w-560 desk:-top-7 desk:left-52 desk:h-85 desk:w-464",
    reward: "top-100 left-23 h-104 w-604 desk:top-81 desk:left-76 desk:h-68 desk:w-396",
    form: "ml-52 w-544 desk:ml-75 desk:w-414",
    fieldGap: "mt-20 desk:mt-[calc(8.4*var(--k))]",
    label: "desk:mb-[calc(2.6*var(--k))] desk:h-26 desk:text-[calc(21.4*var(--k))] desk:leading-26 desk:font-semibold desk:tracking-[.027em]",
    input: [
      "h-67 rounded-[calc(8*var(--k))] bg-[#101010] px-23 pt-0 pb-4 text-[max(16px,calc(28.6*var(--k)))] font-medium tracking-[.022em] [--in-b:calc(1.4*var(--k))] [--in-bc:#262626] placeholder:text-[#c4c4c4]",
      "desk:h-38 desk:rounded-[calc(4*var(--k))] desk:bg-[#0d0d0d] desk:px-12 desk:pb-0 desk:text-[max(16px,calc(19*var(--k)))] desk:tracking-normal desk:[--in-b:calc(1*var(--k))] desk:[--in-bc:#2c2e2d]",
    ].join(" "),
    inputWithEye: "pr-85 desk:pr-55",
    eye: [
      "pr-[calc(20.94*var(--k))] pl-23 [&_svg]:size-[calc(37.12*var(--k))] [&_svg]:translate-y-[calc(-0.5*var(--k))]",
      "desk:pr-[calc(11.56*var(--k))] desk:pl-13 desk:[&_svg]:size-[calc(25.88*var(--k))] desk:[&_svg]:translate-y-0",
    ].join(" "),
    error: "mt-6 text-[calc(23*var(--k))] desk:h-26 desk:text-[calc(16*var(--k))]",
    rowError: "mt-6 text-[calc(23*var(--k))] desk:h-auto desk:text-[calc(14.5*var(--k))]",
    row: [
      "mt-[calc(20.1*var(--k))] min-h-32 text-[calc(28.6*var(--k))] leading-32 font-medium tracking-[.017em]",
      "desk:mt-[calc(7.95*var(--k))] desk:min-h-24 desk:text-[calc(22.9*var(--k))] desk:leading-24 desk:tracking-normal",
    ].join(" "),
    check: "ml-2 desk:-ml-1",
    checkBox: [
      "mr-24 size-32 rounded-[calc(4*var(--k))] border-[calc(2.5*var(--k))]",
      "desk:mr-12 desk:size-20 desk:rounded-[calc(3*var(--k))] desk:border-[calc(2*var(--k))]",
    ].join(" "),
    smallLink: "",
    submit: [
      "mt-[calc(23.4*var(--k))] -ml-3 h-99 w-551 pt-6 pl-0 font-semi text-[calc(47.1*var(--k))] font-semibold tracking-[-.029em] text-[#fff6f4]",
      "[text-shadow:0_2px_2px_rgba(40,0,0,.75)]",
      "desk:mt-[calc(7.15*var(--k))] desk:ml-31 desk:h-75 desk:w-344 desk:pt-0 desk:pl-16 desk:text-[calc(34.3*var(--k))] desk:tracking-[-.022em]",
      "desk:[text-shadow:0_2px_2px_rgba(40,0,0,.7)]",
    ].join(" "),
    switchGap: "ml-[calc(18.5*var(--k))]",
    switchMobile: [
      "mt-[calc(14.4*var(--k))] h-34 translate-x-[calc(1.5*var(--k))] text-[calc(31.4*var(--k))] leading-34 font-medium tracking-[.026em] [&_a]:tracking-[.016em] [&_a]:text-[#eec881] [&_a]:no-underline",
    ],
    switchDesktop: [
      "mt-[calc(3.8*var(--k))] h-27 -translate-x-[calc(3.5*var(--k))] text-[calc(24.3*var(--k))] leading-27 font-medium tracking-[.028em]",
      "-mt-[calc(1.95*var(--k))] h-24 -translate-x-[calc(4.5*var(--k))] text-[calc(22.9*var(--k))] leading-24 font-medium tracking-[.04em] [&_a]:tracking-[.04em] [&_a]:text-[#f0bf5e] [&_a]:no-underline",
    ],
  },
};
