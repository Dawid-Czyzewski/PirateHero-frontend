"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  CONTACT_TOPICS,
  contactFieldClass,
} from "@/components/legal/contactFormConfig";

export function TopicSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = CONTACT_TOPICS.find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="topic" value={value} required />
      <button
        type="button"
        id="contact-topic"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${contactFieldClass} flex items-center justify-between gap-3 text-left ${
          selected ? "text-white" : "text-zinc-500"
        }`}
      >
        <span className="truncate">
          {selected ? selected.label : "Wybierz temat"}
        </span>
        <svg
          viewBox="0 0 256 256"
          className={`h-4 w-4 shrink-0 text-red-600 transition ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby="contact-topic"
          className="absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-auto border border-red-600/50 bg-[#121212] py-1 shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
        >
          {CONTACT_TOPICS.map((item) => {
            const isActive = item.value === value;
            return (
              <li key={item.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`flex w-full px-3.5 py-2.5 text-left text-[0.9rem] normal-case tracking-normal transition sm:text-[0.95rem] ${
                    isActive
                      ? "bg-red-600/20 font-semibold text-white"
                      : "text-zinc-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
