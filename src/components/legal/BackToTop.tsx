"use client";

import { useEffect, useState } from "react";
import { LEGAL_TITLE_ID } from "@/components/legal/legalIds";

const BUTTON = [
  "fixed right-[16px] bottom-[calc(16px+env(safe-area-inset-bottom)+var(--ckb-h,0px)+var(--foot-h,54px))] z-45 grid size-[52px] place-items-center rounded-full",
  "bg-[radial-gradient(circle_at_50%_30%,#ffe29a,#f0c35a_45%,#b8862f_100%)] text-[#2a1606]",
  "shadow-[inset_0_0_0_2px_#fff0c0,inset_0_0_0_4px_#9a6a1c,0_4px_14px_rgba(0,0,0,.75),0_0_18px_rgba(240,195,90,.35)]",
  "transition-[opacity,transform] duration-200 hover:brightness-110 motion-reduce:transition-none",
  "desk:right-[max(16px,calc((100vw-min(100vw-2*var(--pad),calc(1100*var(--k))))/2-72px))] desk:bottom-[calc(24px+var(--ckb-h,0px)+var(--foot-h,54px))] desk:size-[56px]",
].join(" ");

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
      className={`${BUTTON} ${on ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-[12px] opacity-0"}`}
      href="#main"
      aria-label="Wróć na górę strony"
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        const h = document.getElementById(LEGAL_TITLE_ID);
        if (h) {
          h.setAttribute("tabindex", "-1");
          h.focus({ preventScroll: true });
        }
      }}
    >
      <svg className="size-[24px]" viewBox="0 0 24 24" aria-hidden="true">
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
