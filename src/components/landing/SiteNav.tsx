"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isCurrent } from "./nav";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden h-10 min-w-0 items-center justify-center gap-3 lg:flex xl:gap-8"
      aria-label="Główne"
    >
      {NAV.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative inline-flex h-10 shrink-0 items-center whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.08em] xl:text-[0.7rem] xl:tracking-[0.16em] ${
              current
                ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-red-600"
                : "text-zinc-300 transition hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
