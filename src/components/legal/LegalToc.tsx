"use client";

import { useEffect, useRef, useState } from "react";

const DESK = "(min-width: 900px) and (min-aspect-ratio: 1/1)";

type TocItem = { id: string; n: string; label: string };

const NAV = "fl-panel phone:px-44 phone:py-30 desk:sticky desk:top-[calc(var(--head)+20*var(--k))] desk:px-26 desk:pt-32 desk:pb-30";

const SUMMARY = [
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-[12px] [&::-webkit-details-marker]:hidden",
  "phone:min-h-[max(calc(54*var(--k)),44px)] desk:pointer-events-none desk:cursor-default desk:justify-center",
].join(" ");

const CHEVRON =
  "size-34 min-h-[22px] min-w-[22px] flex-none text-gold transition-transform duration-200 group-open/toc:rotate-180 motion-reduce:transition-none desk:hidden";

const LIST = [
  "m-0 list-none p-0 phone:mt-12 desk:mt-16",
  "desk:max-h-[calc(100dvh-var(--head)-170*var(--k))] desk:overflow-y-auto desk:overscroll-contain desk:[scrollbar-color:#6b5224_transparent] desk:[scrollbar-width:thin]",
].join(" ");

const LINK = [
  "relative flex min-h-[44px] items-center gap-[.35em] border-b border-white/7 py-[6px] pr-[6px] pl-16",
  "font-cond text-[calc(25*var(--k))] leading-[1.2] font-medium tracking-[.01em] text-[#e9e2d8] no-underline hover:text-gold",
  "aria-[current=true]:text-gold aria-[current=true]:before:absolute aria-[current=true]:before:inset-y-[22%] aria-[current=true]:before:left-0",
  "aria-[current=true]:before:w-[3px] aria-[current=true]:before:rounded-[2px] aria-[current=true]:before:bg-fire",
  "aria-[current=true]:before:shadow-[0_0_8px_rgba(224,52,42,.7)] aria-[current=true]:before:content-['']",
  "desk:min-h-[max(44px,calc(46*var(--k)))] desk:pl-14 desk:text-[max(15px,calc(19*var(--k)))]",
].join(" ");

export function LegalToc({ items }: { items: readonly TocItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const [desk, setDesk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESK);
    const sync = () => {
      setDesk(mq.matches);
      if (detailsRef.current) detailsRef.current.open = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const secs = items.map((it) => document.getElementById(it.id));
    let ticking = false;
    let cur = -1;
    const onScroll = () => {
      ticking = false;
      const line = window.innerHeight * 0.3;
      let i = 0;
      for (let j = 0; j < secs.length; j++) {
        const el = secs[j];
        if (el && el.getBoundingClientRect().top <= line) i = j;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        i = secs.length - 1;
      }
      if (i !== cur) {
        cur = i;
        setCurrent(i);
        const list = listRef.current;
        if (desk && list) {
          const link = list.querySelector<HTMLAnchorElement>(`a[href="#${items[i]?.id}"]`);
          if (link) {
            const r = link.getBoundingClientRect();
            const lr = list.getBoundingClientRect();
            if (r.top < lr.top || r.bottom > lr.bottom) {
              list.scrollTop += r.top - lr.top - lr.height / 2 + r.height / 2;
            }
          }
        }
      }
    };
    const onScrollRaf = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    };
    window.addEventListener("scroll", onScrollRaf, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScrollRaf);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, desk]);

  return (
    <nav className={NAV} aria-labelledby="toc-h">
      <details
        ref={detailsRef}
        className="group/toc"
        open={desk}
        onClick={(e) => {
          if (desk && (e.target as HTMLElement).closest("summary")) {
            e.preventDefault();
          }
        }}
      >
        <summary className={SUMMARY}>
          <h2
            className="font-cond text-[calc(32*var(--k))] leading-none font-bold tracking-[.02em] text-[#f3eadb] uppercase desk:text-[calc(28*var(--k))]"
            id="toc-h"
          >
            Spis treści
          </h2>
          <svg className={CHEVRON} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 9l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <ol ref={listRef} className={LIST}>
          {items.map((it, i) => (
            <li key={it.id} className="[&:last-child>a]:border-b-0">
              <a
                className={LINK}
                href={`#${it.id}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => {
                  if (!desk && detailsRef.current) {
                    detailsRef.current.open = false;
                  }
                }}
              >
                <span className="min-w-[1.4em] flex-none">{it.n}.</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
