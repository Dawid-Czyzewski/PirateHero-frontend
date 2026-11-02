export function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M13.6 2h3.1c.2 1.6.9 2.9 2 3.8.9.7 2 1.1 3.3 1.2v3.2a9 9 0 0 1-5.2-1.7v6.9a6.6 6.6 0 1 1-6.6-6.6c.3 0 .7 0 1 .1v3.3a3.4 3.4 0 1 0 2.4 3.2z"
      />
    </svg>
  );
}

export function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle cx="17.4" cy="6.7" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.2V8.8l5.3 3.2z"
      />
    </svg>
  );
}

export function IconDiscord() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.3 5.2c1.4-.6 2.8-1 4.1-1.1l.5 1c1-.1 1.9-.1 2.9 0l.5-1c1.3.1 2.7.5 4.1 1.1 2 3 2.8 6.3 2.6 9.8-1.6 1.3-3.3 2.1-5 2.6l-1.1-1.7c.7-.2 1.3-.5 1.9-.9l-.5-.4c-3.5 1.6-7.1 1.6-10.6 0l-.5.4c.6.4 1.2.7 1.9.9L7 17.6c-1.7-.5-3.4-1.3-5-2.6-.3-3.5.6-6.8 2.6-9.8zm2.4 8.1c.9 0 1.6-.9 1.6-1.9s-.7-1.9-1.6-1.9-1.6.9-1.6 1.9.7 1.9 1.6 1.9zm6.6 0c.9 0 1.6-.9 1.6-1.9s-.7-1.9-1.6-1.9-1.6.9-1.6 1.9.7 1.9 1.6 1.9z"
        transform="translate(-1 1)"
      />
    </svg>
  );
}

export const SOCIALS = [
  { name: "TikTok", href: "#", Icon: IconTikTok },
  { name: "Instagram", href: "#", Icon: IconInstagram },
  { name: "YouTube", href: "#", Icon: IconYouTube },
  { name: "Discord", href: "#", Icon: IconDiscord },
] as const;
