export const NAV = [
  { href: "/", label: "Strona główna" },
  { href: "/o-grze", label: "O grze" },
  { href: "/contact", label: "Kontakt" },
];

export function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
