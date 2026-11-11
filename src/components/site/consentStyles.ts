export const CONSENT_SURFACE = [
  "font-semi text-[#f2efea] antialiased",
  "[&_:focus-visible]:rounded [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-offset-3 [&_:focus-visible]:outline-gold",
].join(" ");

export const CONSENT_CARD = [
  "rounded-[10px] bg-coal",
  "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:rounded-t-[10px] before:bg-fire before:shadow-[0_0_10px_rgb(224_52_42/0.6)] before:content-['']",
].join(" ");

export const CONSENT_LINK = [
  "relative inline-block cursor-pointer border-0 bg-transparent p-0 text-gold underline underline-offset-[0.18em] [font:inherit]",
  "hover:text-gold-light",
  "after:absolute after:-inset-x-1.5 after:top-1/2 after:-mt-[22px] after:h-11 after:content-['']",
].join(" ");

const FRAME_BUTTON = [
  "flex min-h-11 flex-[1_1_0] cursor-pointer items-center justify-center whitespace-nowrap px-1",
  "border-[14px] border-solid bg-transparent font-cond text-[16px] leading-none font-bold tracking-[0.04em] uppercase",
  "hover:brightness-110",
].join(" ");

export const GOLD_FRAME_BUTTON = `${FRAME_BUTTON} text-[#1d1206] [border-image:url(/assets/fl/frames/btn-gold@2x.png)_40_fill_/_14px_stretch]`;

export const DARK_FRAME_BUTTON = `${FRAME_BUTTON} text-[#f4efe8] [border-image:url(/assets/fl/frames/nav@2x.png)_40_fill_/_14px_stretch]`;
