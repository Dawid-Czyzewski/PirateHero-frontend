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

const FOOTER = [
  "relative z-5 mt-auto flex-none bg-[linear-gradient(#0c0707,#050303)] font-semi text-dust [--spacing:0.25rem]",
  "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:content-['']",
  "before:bg-[linear-gradient(90deg,rgb(184_134_47/0),#b8862f_16%,#f0c35a_34%,#d8322a_50%,#f0c35a_66%,#b8862f_84%,rgb(184_134_47/0))]",
  "after:absolute after:inset-x-0 after:top-0.5 after:h-px after:bg-black/80 after:content-['']",
].join(" ");

const INNER = [
  "mx-auto flex max-w-[1280px] flex-col items-center gap-3 px-4 pt-[22px] pb-[calc(22px+env(safe-area-inset-bottom))] text-center",
  "desk:h-(--foot-h) desk:flex-row desk:justify-between desk:gap-5 desk:px-7 desk:pt-[3px] desk:pb-0 desk:text-left",
  "desk-mid:flex-wrap desk-mid:content-center desk-mid:justify-center desk-mid:gap-y-0.5 desk-mid:pt-1.5",
  "desk-xl:max-w-[1600px]",
].join(" ");

const COPY = [
  "order-3 mt-1 max-w-[300px] text-[14px] leading-[1.4]",
  "desk:order-1 desk:m-0 desk:max-w-none",
  "desk-mid:order-4 desk-mid:basis-full desk-mid:text-center desk-mid:text-[13px]",
  "desk-xl:text-[15.5px]",
].join(" ");

const NAV = "order-2 grid w-full max-w-[340px] grid-cols-2 gap-x-2 desk:flex desk:w-auto desk:max-w-none desk:gap-x-0";

const NAV_LINK = [
  "flex min-h-11 items-center justify-center font-cond text-[17px] font-semibold tracking-[0.02em] text-parchment no-underline",
  "[&:last-child:nth-child(odd)]:col-span-full aria-[current=page]:text-gold",
  "hover:text-gold hover:underline hover:underline-offset-[0.2em]",
  "desk:relative desk:px-3 desk:text-[15.5px]",
  "desk:not-first:before:absolute desk:not-first:before:top-1/2 desk:not-first:before:-left-0.5 desk:not-first:before:-mt-0.5",
  "desk:not-first:before:size-1 desk:not-first:before:rounded-full desk:not-first:before:bg-[#8c6a2c] desk:not-first:before:content-['']",
  "desk-xl:text-[17px]",
].join(" ");

const SOCIAL_LIST = "order-1 m-0 flex list-none gap-3 p-0 desk:order-3 desk:gap-2";

const SOCIAL_LINK = [
  "grid size-11 place-items-center rounded-full border border-gold/45 text-parchment transition-colors",
  "bg-[radial-gradient(circle_at_50%_35%,rgb(255_255_255/0.07),rgb(255_255_255/0)_70%)]",
  "hover:border-fire hover:bg-[#9e1f18] hover:text-white",
  "[&_svg]:block [&_svg]:size-5",
  "desk:relative desk:size-9 desk:after:absolute desk:after:-inset-1 desk:after:rounded-full desk:after:content-[''] desk:[&_svg]:size-[17px]",
].join(" ");

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className={FOOTER}>
      <div className={INNER}>
        <p className={COPY}>© 2026 Freak Legends. Wszystkie postacie i&nbsp;federacje są fikcyjne.</p>
        <nav className={NAV} aria-label="Stopka">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={NAV_LINK}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ul className={SOCIAL_LIST} aria-label="Media społecznościowe">
          {SOCIALS.map(({ name, href, Icon }) => (
            <li key={name}>
              <a href={href} className={SOCIAL_LINK} aria-label={`Freak Legends na ${name}`}>
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
