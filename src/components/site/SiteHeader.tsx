"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const NAV = [
  { href: "/", label: "Strona główna" },
  { href: "/o-grze", label: "O grze" },
  { href: "/contact", label: "Kontakt" },
] as const;

const DESK = "(min-width: 900px) and (min-aspect-ratio: 1/1)";

const HEADER = [
  "relative z-20",
  "desk:sticky desk:top-0 desk:z-40 desk:bg-[linear-gradient(rgba(12,7,6,.94),rgba(12,7,6,.82))] desk:backdrop-blur-[6px]",
  "desk:after:absolute desk:after:inset-x-0 desk:after:bottom-0 desk:after:h-[2px] desk:after:opacity-55 desk:after:content-['']",
  "desk:after:bg-[linear-gradient(90deg,rgba(184,134,47,0),#b8862f_15%,#f0c35a_50%,#b8862f_85%,rgba(184,134,47,0))]",
].join(" ");

const INNER = "relative mx-auto h-100 w-720 desk:flex desk:h-(--head) desk:items-center desk:gap-32";

const INNER_WIDTH = {
  standard: "desk:w-[min(calc(100%-2*var(--pad)),calc(1320*var(--k)))]",
  wide: "desk:w-[min(calc(100%-2*var(--pad)),2200px)]",
} as const;

const LOGO = [
  "absolute top-8 left-22 min-h-[44px] w-162 [&_img]:h-auto [&_img]:w-full",
  "desk:static desk:h-[calc(var(--head)-2*var(--k))] desk:min-h-0 desk:w-auto desk:flex-none desk:[&_img]:h-full desk:[&_img]:w-auto",
].join(" ");

const NAV_BAR = "hidden desk:static desk:mx-auto desk:block desk:h-full";

const NAV_LINK = [
  "relative flex h-full items-center px-[2px] font-cond text-[calc(21*var(--k))] leading-none font-medium tracking-[0.01em] whitespace-nowrap text-[#f2efea] no-underline",
  "hover:text-gold aria-[current=page]:text-white",
  "aria-[current=page]:after:absolute aria-[current=page]:after:-inset-x-12 aria-[current=page]:after:bottom-12 aria-[current=page]:after:h-3",
  "aria-[current=page]:after:rounded-[calc(2*var(--k))] aria-[current=page]:after:content-['']",
  "aria-[current=page]:after:bg-[linear-gradient(90deg,rgba(240,195,90,0),#c99a3e_18%,#f0c35a_50%,#c99a3e_82%,rgba(240,195,90,0))]",
].join(" ");

const HEADER_BUTTON = [
  "flex h-44 items-center justify-center px-22 border-solid border-[calc(13*var(--k))]",
  "font-cond text-[calc(19*var(--k))] leading-none font-semibold whitespace-nowrap text-[#f2efea] no-underline transition-[filter] duration-150 hover:brightness-125",
].join(" ");

const HEADER_BUTTON_FRAME = {
  dark: "[border-image:url(/assets/fl/frames/nav@2x.png)_40_fill_/_calc(13*var(--k))_stretch]",
  red: "[border-image:url(/assets/fl/frames/btn-red@2x.png)_40_fill_/_calc(13*var(--k))_stretch]",
} as const;

const BURGER = [
  "absolute isolate flex cursor-pointer flex-col items-center justify-center gap-9 border-0 bg-transparent p-0 text-[#f2ede6] hover:text-gold",
  "top-[max(calc(18*var(--k)),calc(49*var(--k)-22px))] right-[max(calc(20*var(--k)),calc(60*var(--k)-22px))]",
  "h-[max(calc(62*var(--k)),44px)] w-[max(calc(80*var(--k)),44px)]",
  "before:absolute before:top-1/2 before:left-1/2 before:-z-1 before:h-62 before:w-80 before:-translate-1/2 before:content-['']",
  "before:border-solid before:border-[calc(16*var(--k))] before:[border-image:url(/assets/fl/frames/nav@2x.png)_40_fill_/_calc(16*var(--k))_stretch]",
  "desk:hidden",
].join(" ");

const BURGER_BAR = "block h-5 w-40 flex-none rounded-[calc(3*var(--k))] bg-current";

const MENU_LINK = [
  "flex min-h-[52px] items-center border-b border-white/8 px-1.5 font-cond text-[22px] leading-none font-semibold tracking-[0.02em] text-[#f2ede6] uppercase no-underline",
  "hover:text-gold aria-[current=page]:text-gold",
].join(" ");

const MENU_BUTTON = "h-[56px] [--fs:44] [--k:0.5px]";

type SiteHeaderProps = {
  wide: boolean;
};

export function SiteHeader({ wide }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = (returnFocus = true) => {
    setOpen(false);
    document.documentElement.classList.remove("overflow-hidden");
    if (returnFocus) burgerRef.current?.focus();
  };

  const openMenu = () => {
    setOpen(true);
    document.documentElement.classList.add("overflow-hidden");
    requestAnimationFrame(() => closeRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        );
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia(DESK);
    const onChange = (m: MediaQueryListEvent) => {
      if (m.matches) close(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => () => document.documentElement.classList.remove("overflow-hidden"), []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={HEADER}>
      <div className={`${INNER} ${INNER_WIDTH[wide ? "wide" : "standard"]}`}>
        <Link className={LOGO} href="/">
          <Image src="/assets/site/logo.webp" width={292} height={148} alt="Freak Legends – strona główna" priority unoptimized />
        </Link>
        <nav className={NAV_BAR} aria-label="Główna">
          <ul className="flex h-full gap-44">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  className={NAV_LINK}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden desk:flex desk:flex-none desk:gap-14">
          <Link className={`${HEADER_BUTTON} ${HEADER_BUTTON_FRAME.dark}`} href="/login">
            Zaloguj
          </Link>
          <Link className={`${HEADER_BUTTON} ${HEADER_BUTTON_FRAME.red}`} href="/register">
            Załóż konto
          </Link>
        </div>
        <button
          ref={burgerRef}
          className={BURGER}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Otwórz menu"
          onClick={openMenu}
        >
          <span className={BURGER_BAR} />
          <span className={BURGER_BAR} />
          <span className={BURGER_BAR} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-60 bg-black/60 transition-opacity duration-200 [--spacing:0.25rem] motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        id={menuId}
        hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          ref={panelRef}
          className={`absolute inset-y-0 right-0 flex w-[min(340px,86vw)] flex-col gap-[22px] overflow-y-auto border-l-2 border-[#5a4632] bg-[linear-gradient(#140c0b,#070404)] px-[22px] pt-[72px] pb-7 shadow-[-10px_0_30px_rgba(0,0,0,.7)] transition-transform duration-[220ms] ease-out motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            ref={closeRef}
            className="absolute top-3.5 right-3.5 grid size-12 cursor-pointer place-items-center rounded-[10px] border border-gold/45 bg-transparent text-[#f2ede6]"
            type="button"
            aria-label="Zamknij menu"
            onClick={() => close()}
          >
            <svg className="size-[22px]" viewBox="0 0 24 24" aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  className={MENU_LINK}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => close(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <Link className={`fl-btn ${MENU_BUTTON}`} href="/register" onClick={() => close(false)}>
              Zagraj za darmo
            </Link>
            <Link className={`fl-btn fl-btn-dark ${MENU_BUTTON}`} href="/login" onClick={() => close(false)}>
              Zaloguj
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
