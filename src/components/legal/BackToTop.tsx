"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <a
      className={`totop${on ? " is-on" : ""}`}
      href="#main"
      aria-label="Wróć na górę strony"
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        const h = document.querySelector<HTMLElement>(".ltitle");
        if (h) {
          h.setAttribute("tabindex", "-1");
          h.focus({ preventScroll: true });
        }
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 15l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
