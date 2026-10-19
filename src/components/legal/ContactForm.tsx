"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SkewButton } from "@/components/landing/SkewButton";

const TOPICS = [
  { value: "konto", label: "Konto / logowanie" },
  { value: "rubiny", label: "Problem z rubinami" },
  { value: "platnosci", label: "Płatności" },
  { value: "blad", label: "Zgłoszenie błędu" },
  { value: "wspolpraca", label: "Współpraca / media" },
  { value: "inne", label: "Inne" },
] as const;

const fieldClass =
  "w-full border border-red-600/50 bg-[#0c0c0c] px-3.5 py-3 text-[0.9rem] uppercase tracking-[0.06em] text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/40 sm:py-3.5 sm:text-[0.95rem]";

function TopicSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = TOPICS.find((item) => item.value === value);

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
        className={`${fieldClass} flex items-center justify-between gap-3 text-left ${
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
          {TOPICS.map((item) => {
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

export function ContactForm() {
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nick.trim() || !email.trim() || !topic || !message.trim() || !accepted) {
      setStatus("error");
      return;
    }

    const topicLabel =
      TOPICS.find((item) => item.value === topic)?.label ?? topic;
    const subject = encodeURIComponent(`[Freak Legends] ${topicLabel}`);
    const body = encodeURIComponent(
      `Nick: ${nick.trim()}\nE-mail: ${email.trim()}\nTemat: ${topicLabel}\n\n${message.trim()}`,
    );
    window.location.href = `mailto:support@freaklegends.pl?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <form className="flex flex-col gap-3.5 sm:gap-4" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="contact-nick">
        Nazwa gracza (nick)
      </label>
      <input
        id="contact-nick"
        name="nick"
        type="text"
        autoComplete="username"
        placeholder="Nazwa gracza (nick)"
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        className={fieldClass}
        required
      />

      <label className="sr-only" htmlFor="contact-email">
        Adres e-mail
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Adres e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={fieldClass}
        required
      />

      <label className="sr-only" htmlFor="contact-topic">
        Wybierz temat
      </label>
      <TopicSelect value={topic} onChange={setTopic} />

      <label className="sr-only" htmlFor="contact-message">
        Treść wiadomości
      </label>
      <textarea
        id="contact-message"
        name="message"
        rows={5}
        placeholder="Treść wiadomości"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${fieldClass} min-h-[10rem] resize-y normal-case tracking-normal`}
        required
      />

      <label className="mt-1 flex cursor-pointer items-start gap-2.5 text-[0.8rem] leading-snug text-zinc-300 sm:text-[0.85rem]">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-red-600 bg-black/50 checked:bg-red-600"
          required
        />
        <span>
          Akceptuję{" "}
          <Link
            href="/privacy"
            className="font-semibold text-white underline decoration-red-600 underline-offset-4 hover:text-red-500"
          >
            politykę prywatności
          </Link>
        </span>
      </label>

      <div className="mt-4 ml-3 flex justify-start sm:ml-1">
        <SkewButton
          type="submit"
          size="lg"
          className="max-w-[min(100%,18.5rem)] sm:max-w-none"
        >
          Wyślij wiadomość
        </SkewButton>
      </div>

      {status === "error" ? (
        <p className="text-[0.75rem] text-red-400" role="alert">
          Uzupełnij wszystkie pola i zaakceptuj politykę prywatności.
        </p>
      ) : null}
      {status === "sent" ? (
        <p className="text-[0.75rem] text-zinc-300" role="status">
          Otwieramy klienta poczty. Jeśli nic się nie stało, napisz na
          support@freaklegends.pl.
        </p>
      ) : null}
    </form>
  );
}
