import type { ReactNode } from "react";

export function ContactCard({
  number,
  title,
  children,
  className = "",
}: {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `contact-section-${number}`;

  return (
    <section
      className={`relative flex flex-col overflow-visible rounded-sm border border-red-600/35 bg-[#141414]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <span
        className="pointer-events-none absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-red-600"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-red-600"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_40%,rgba(0,0,0,0.25)_100%)]"
        aria-hidden
      />

      <header className="relative z-10 px-5 pb-3 pt-5 sm:px-7 sm:pt-7">
        <h2
          id={headingId}
          className="text-base font-extrabold uppercase tracking-[0.06em] text-white sm:text-lg"
        >
          <span className="text-red-600">{number}.</span> {title}
        </h2>
      </header>

      <div className="relative z-10 px-5 pb-6 sm:px-7 sm:pb-7">{children}</div>
    </section>
  );
}
