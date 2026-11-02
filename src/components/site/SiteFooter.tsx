"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SOCIALS } from "@/components/site/socialIcons";

const LINKS = [
  { href: "/terms", label: "Regulamin" },
  { href: "/privacy", label: "Polityka prywatności" },
  { href: "/cookies", label: "Polityka cookies" },
  { href: "/contact", label: "Kontakt" },
] as const;

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="site-foot">
      <div className="site-foot__in">
        <p className="site-foot__copy">
          © 2026 Freak Legends. Wszystkie postacie i&nbsp;federacje są fikcyjne.
        </p>
        <nav className="site-foot__nav" aria-label="Stopka">
          {LINKS.map((item) => {
            const path = item.href.split("#")[0];
            const current = pathname === path;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ul className="site-foot__social" aria-label="Media społecznościowe">
          {SOCIALS.map(({ name, href, Icon }) => (
            <li key={name}>
              <a href={href} aria-label={`Freak Legends na ${name}`}>
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
