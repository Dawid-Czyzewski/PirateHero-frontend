export type NavLayout = "side" | "bar";

export const FOCUS_RING = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold";

export const ENTRY: Record<NavLayout, string> = {
  side: "relative grid min-h-11 w-full justify-items-center gap-1 rounded-md px-1 py-2 text-center",
  bar: "relative grid min-h-11 w-full justify-items-center gap-0.5 rounded-md px-0.5 pt-1.5 pb-1 text-center",
};

export const ICON_SIZE: Record<NavLayout, string> = {
  side: "size-12",
  bar: "size-8",
};

export const LABEL: Record<NavLayout, string> = {
  side: "font-cond text-sm leading-none font-bold tracking-[.06em] uppercase",
  bar: "font-cond text-[0.72rem] leading-none font-bold tracking-[.04em] uppercase",
};

export const ACTIVE = "bg-blood/25 text-white shadow-[inset_0_0_0_2px_var(--color-blood)]";

export const IDLE = "text-[#e8e1d6] hover:bg-white/8";

export const SOON = "cursor-default text-ash";
