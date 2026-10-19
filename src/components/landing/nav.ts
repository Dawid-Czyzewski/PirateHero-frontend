export const NAV = [
  { href: "/", label: "Strona główna" },
  { href: "/o-grze", label: "O grze" },
  { href: "/aktualnosci", label: "Aktualności" },
  { href: "/rankingi", label: "Rankingi" },
  { href: "/contact#spolecznosc", label: "Społeczność" },
  { href: "/contact", label: "Kontakt" },
];

export function isCurrent(pathname: string, href: string) {
  const path = href.split("#")[0] || "/";
  if (path === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}
