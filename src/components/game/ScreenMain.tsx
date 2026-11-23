import type { ReactNode } from "react";

const MAIN = [
  "relative z-1 mx-auto flex w-full max-w-[40rem] flex-1 flex-col gap-3 px-3 pt-3 pb-6 sm:px-4",
  "desk:max-w-[min(100%-3rem,72rem)] desk:gap-4 desk:px-0 desk:pt-4",
].join(" ");

export function ScreenMain({ children }: { children: ReactNode }) {
  return <main className={MAIN}>{children}</main>;
}
