"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const NAV = [
  { href: "/", label: "Strona główna" },
  { href: "/o-grze", label: "O grze" },
  { href: "/contact", label: "Kontakt" },
] as const;

const DESK = "(min-width: 900px) and (min-aspect-ratio: 1/1)";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = (returnFocus = true) => {
    setOpen(false);
    document.documentElement.classList.remove("menu-open");
    if (returnFocus) burgerRef.current?.focus();
  };

  const openMenu = () => {
    setOpen(true);
    document.documentElement.classList.add("menu-open");
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

  useEffect(() => () => document.documentElement.classList.remove("menu-open"), []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-head">
      <div className="site-head__in">
        <Link className="site-head__logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/site/logo.webp"
            width={292}
            height={148}
            alt="Freak Legends – strona główna"
          />
        </Link>
        <nav className="site-head__nav" aria-label="Główna">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  className="site-head__link"
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-head__cta">
          <Link className="hbtn hbtn--dark" href="/login">
            Zaloguj
          </Link>
          <Link className="hbtn hbtn--red" href="/register">
            Załóż konto
          </Link>
        </div>
        <button
          ref={burgerRef}
          className="site-head__burger"
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Otwórz menu"
          onClick={openMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`site-menu${open ? " is-open" : ""}`}
        id={menuId}
        hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          ref={panelRef}
          className="site-menu__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            ref={closeRef}
            className="site-menu__close"
            type="button"
            aria-label="Zamknij menu"
            onClick={() => close()}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ul className="site-menu__list">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  className="site-menu__link"
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => close(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="site-menu__cta">
            <Link className="btn btn--gold" href="/register" onClick={() => close(false)}>
              Zagraj za darmo
            </Link>
            <Link className="btn btn--dark" href="/login" onClick={() => close(false)}>
              Zaloguj
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
