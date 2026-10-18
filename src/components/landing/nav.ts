export const NAV = [
  { href: "/", label: "Strona główna" },
  { href: "/o-grze", label: "O grze" },
  { href: "/aktualnosci", label: "Aktualności" },
  { href: "/rankingi", label: "Rankingi" },
  { href: "/contact", label: "Społeczność" },
];

export function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
