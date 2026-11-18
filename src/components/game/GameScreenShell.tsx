import type { ReactNode } from "react";
import { Logo } from "@/components/landing/Logo";

type GameScreenShellProps = {
  label?: string;
  children: ReactNode;
};

const ROOT = [
  "relative flex min-h-dvh flex-col overflow-x-clip bg-[#070404] font-cond font-medium text-[#f2efea] antialiased",
  "[--k:calc(min(100vw,560px)/720)] desk:[--k:clamp(0.8px,calc(100vw/1440),1.1px)]",
  "[&_:where(a,button):focus-visible]:outline-3 [&_:where(a,button):focus-visible]:outline-offset-3 [&_:where(a,button):focus-visible]:outline-gold",
].join(" ");

const BACKDROP = [
  "pointer-events-none fixed inset-0 z-0",
  "[background:linear-gradient(rgba(7,4,4,.55),rgba(7,4,4,.35)_30%,rgba(7,4,4,.8)_70%,#070404),url(/assets/fl/backgrounds/bg-mobile.webp)_center_top_/_cover_no-repeat]",
  "desk:[background:radial-gradient(ellipse_80%_75%_at_50%_40%,rgba(7,4,4,.1)_0%,rgba(7,4,4,.45)_62%,rgba(7,4,4,.88)_100%),linear-gradient(rgba(7,4,4,.25),rgba(7,4,4,.45)_65%,rgba(7,4,4,.85)),url(/assets/site/bg-arena-hero-d.webp)_center_35%_/_cover_no-repeat]",
].join(" ");

export function GameScreenShell({ label, children }: GameScreenShellProps) {
  return (
    <div className={ROOT}>
      <div className={BACKDROP} aria-hidden="true" />
      {label ? (
        <header className="relative z-2 mx-auto flex w-full max-w-[40rem] items-center justify-between gap-3 px-3 pt-3 pb-1 sm:px-4 desk:max-w-[min(100%-3rem,88rem)] desk:px-0 desk:pt-3 desk:pb-2">
          <Logo />
          <p className="m-0 font-cond text-xs font-bold tracking-[.18em] text-gold uppercase sm:text-sm">{label}</p>
        </header>
      ) : null}
      {children}
    </div>
  );
}
