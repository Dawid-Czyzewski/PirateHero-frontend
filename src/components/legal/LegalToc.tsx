"use client";

import { useEffect, useRef, useState } from "react";

const DESK = "(min-width: 900px) and (min-aspect-ratio: 1/1)";

type TocItem = { id: string; n: string; label: string };

export function LegalToc({ items }: { items: readonly TocItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
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
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        i = secs.length - 1;
      }
      if (i !== cur) {
        cur = i;
        setCurrent(i);
        if (desk) {
          const link = document.querySelector<HTMLAnchorElement>(
            `.toc__list a[href="#${items[i]?.id}"]`,
          );
          const list = link?.closest(".toc__list");
          if (link && list) {
            const r = link.getBoundingClientRect();
            const lr = list.getBoundingClientRect();
            if (r.top < lr.top || r.bottom > lr.bottom) {
              list.scrollTop +=
                r.top - lr.top - lr.height / 2 + r.height / 2;
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
    <nav className="toc panel" aria-labelledby="toc-h">
      <details
        ref={detailsRef}
        className="toc__d"
        open={desk}
        onClick={(e) => {
          if (desk && (e.target as HTMLElement).closest("summary")) {
            e.preventDefault();
          }
        }}
      >
        <summary className="toc__sum">
          <h2 className="toc__h" id="toc-h">
            Spis treści
          </h2>
          <svg className="toc__chev" viewBox="0 0 24 24" aria-hidden="true">
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
        <ol className="toc__list">
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={i === current ? "true" : undefined}
                onClick={() => {
                  if (!desk && detailsRef.current) {
                    detailsRef.current.open = false;
                  }
                }}
              >
                <span className="toc__n">{it.n}.</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
