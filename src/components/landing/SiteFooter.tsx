import Link from "next/link";
import { PageFrame } from "./PageFrame";

const LINKS = [
  { href: "/privacy", label: "Polityka prywatności" },
  { href: "/terms", label: "Regulamin" },
  { href: "/contact", label: "Kontakt" },
  { href: "/cookies", label: "Cookies" },
];

const SOCIAL = [
  { href: "https://discord.com", label: "Discord", icon: DiscordIcon },
  { href: "https://youtube.com", label: "YouTube", icon: YoutubeIcon },
];

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M19.7 5.3A18 18 0 0 0 15.2 4l-.4.8a16.4 16.4 0 0 1 3.9 1.2c-3.3-1.6-7-1.6-10.4 0A16 16 0 0 1 9.2 4.8L8.8 4a18 18 0 0 0-4.5 1.3C1.8 9.2 1.1 13 1.4 16.7A18.5 18.5 0 0 0 7 19l.8-1.1a12 12 0 0 1-1.9-1l.4-.3c3.6 1.7 7.6 1.7 11.2 0l.4.3a12 12 0 0 1-1.9 1l.8 1.1a18.5 18.5 0 0 0 5.6-2.3c.4-4.2-.5-8-2.7-11.4ZM9.4 14.6c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.2 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.8-.8-1.4-1.6-1.6C19.4 5.6 12 5.6 12 5.6s-7.4 0-9 0.4c-.8.2-1.4.8-1.6 1.6C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.8.8 1.4 1.6 1.6 1.6.4 9 .4 9 .4s7.4 0 9-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.6.4-4.6ZM9.8 15.5v-6.6l6.3 3.3-6.3 3.3Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-30 w-full border-t border-white/20 bg-[#0a0a0a]">
      <PageFrame className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <p className="text-xs text-zinc-500">
          © 2026 Freak Legends. Wszelkie prawa zastrzeżone.
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Stopka">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {SOCIAL.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-zinc-400 transition hover:border-brand/50 hover:text-white"
            >
              <item.icon />
            </a>
          ))}
        </div>
      </PageFrame>
    </footer>
  );
}
