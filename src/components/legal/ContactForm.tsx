"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SkewButton } from "@/components/landing/SkewButton";
import {
  CONTACT_TOPICS,
  contactFieldClass,
} from "@/components/legal/contactFormConfig";
import { TopicSelect } from "@/components/legal/TopicSelect";

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
      CONTACT_TOPICS.find((item) => item.value === topic)?.label ?? topic;
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
        className={contactFieldClass}
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
        className={contactFieldClass}
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
        className={`${contactFieldClass} min-h-[10rem] resize-y normal-case tracking-normal`}
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
