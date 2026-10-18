"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isCurrent } from "./nav";
import { SkewButton } from "./SkewButton";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className="col-start-3 inline-flex h-10 w-10 items-center justify-center justify-self-end border border-white/30 text-white lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Menu</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open ? (
        <div
          id="mobile-nav"
          className="col-span-3 border-t border-white/10 bg-black/90 py-4 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobilne">
            {NAV.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-bold uppercase tracking-[0.14em] ${
                    current ? "text-red-600" : "text-zinc-300"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SkewButton href="/login" variant="outline" onClick={() => setOpen(false)}>
              Zaloguj się
            </SkewButton>
            <SkewButton href="/register" onClick={() => setOpen(false)}>
              Zarejestruj się
            </SkewButton>
          </div>
        </div>
      ) : null}
    </>
  );
}
