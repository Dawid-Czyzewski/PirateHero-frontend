import Image from "next/image";
import type { ReactNode } from "react";
import { PageFrame } from "@/components/landing/PageFrame";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ContactForm } from "@/components/legal/ContactForm";

const FAQ_ITEMS = [
  "Problem z rubinami",
  "Odzyskiwanie konta",
  "Problem z logowaniem",
  "Płatności i zakupy",
  "Zgłoszenie błędu",
  "Ban / fair play",
];

function ContactCard({
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

function IconMail() {
  return (
    <svg viewBox="0 0 256 256" className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" aria-hidden>
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19Z" />
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg viewBox="0 0 256 256" className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" aria-hidden>
      <path d="M219.69,93.35,187.32,61A22,22,0,0,0,156.2,61L128,89.17,99.8,61A22,22,0,0,0,68.68,61L36.31,93.35a22,22,0,0,0,0,31.11l22.06,22.06a7.94,7.94,0,0,0,3.47,2l36.44,10.41a8,8,0,0,0,6.08-1.37L128,139.31l23.64,18.25a8,8,0,0,0,6.08,1.37l36.44-10.41a8,8,0,0,0,3.47-2l22.06-22.06A22,22,0,0,0,219.69,93.35ZM128,117.65,102.14,137.6,76.3,130.22,54.24,108.16a6,6,0,0,1,0-8.49L86.61,67.3a6,6,0,0,1,8.49,0L128,100.2Zm73.76-9.49-22.06,22.06-25.84,7.38L128,117.65l33.9-33.9a6,6,0,0,1,8.49,0l32.37,32.37A6,6,0,0,1,201.76,108.16Z" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" aria-hidden>
      <path d="M19.7 5.3A18 18 0 0 0 15.2 4l-.4.8a16.4 16.4 0 0 1 3.9 1.2c-3.3-1.6-7-1.6-10.4 0A16 16 0 0 1 9.2 4.8L8.8 4a18 18 0 0 0-4.5 1.3C1.8 9.2 1.1 13 1.4 16.7A18.5 18.5 0 0 0 7 19l.8-1.1a12 12 0 0 1-1.9-1l.4-.3c3.6 1.7 7.6 1.7 11.2 0l.4.3a12 12 0 0 1-1.9 1l.8 1.1a18.5 18.5 0 0 0 5.6-2.3c.4-4.2-.5-8-2.7-11.4ZM9.4 14.6c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.2 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
    </svg>
  );
}

export function ContactPageView() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src="/bg-octagon.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
        </div>

        <div
          className="pointer-events-none absolute bottom-[-4%] right-[-4%] z-[5] hidden h-[min(94vh,900px)] w-[min(44vw,640px)] 2xl:right-[-2%] 2xl:block"
          aria-hidden
        >
          <Image
            src="/images/hero-fighter-v4.png"
            alt=""
            width={605}
            height={676}
            loading="lazy"
            sizes="(max-width: 1535px) 0px, 640px"
            className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.5)]"
          />
        </div>

        <SiteHeader />

        <main className="relative z-20 flex flex-col pb-16 pt-24 md:pb-20 md:pt-28">
          <PageFrame>
            <header className="mb-5 max-w-xl sm:mb-6">
              <h1 className="sr-only">Kontakt z supportem Freak Legends</h1>
              <Image
                src="/images/contact-headline.png"
                alt=""
                width={1021}
                height={690}
                priority
                sizes="(max-width: 768px) 85vw, 28rem"
                className="h-auto w-full max-w-[20rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:max-w-[24rem] lg:max-w-[28rem]"
              />
            </header>

            <div className="grid max-w-[72rem] grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6 xl:max-w-[78rem]">
              <ContactCard
                number="01"
                title="Formularz kontaktowy"
                className="lg:col-span-7"
              >
                <ContactForm />
              </ContactCard>

              <div className="flex flex-col gap-5 self-start lg:col-span-5 lg:gap-6">
                <ContactCard number="02" title="Szybki kontakt">
                  <ul className="space-y-3.5 text-[0.9rem] text-zinc-200 sm:text-[0.95rem]">
                    <li className="flex items-start gap-3">
                      <IconMail />
                      <p>
                        <span className="font-bold uppercase tracking-[0.08em] text-white">
                          E-mail:{" "}
                        </span>
                        <a
                          href="mailto:support@freaklegends.pl"
                          className="font-semibold text-red-500 hover:text-red-400"
                        >
                          support@freaklegends.pl
                        </a>
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <IconHandshake />
                      <p>
                        <span className="font-bold uppercase tracking-[0.08em] text-white">
                          Współpraca:{" "}
                        </span>
                        <a
                          href="mailto:media@freaklegends.pl"
                          className="font-semibold text-red-500 hover:text-red-400"
                        >
                          media@freaklegends.pl
                        </a>
                      </p>
                    </li>
                    <li id="spolecznosc" className="flex items-start gap-3 scroll-mt-28">
                      <IconDiscord />
                      <p>
                        <span className="font-bold uppercase tracking-[0.08em] text-white">
                          Discord:{" "}
                        </span>
                        <a
                          href="https://discord.com"
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-red-500 hover:text-red-400"
                        >
                          dołącz do społeczności
                        </a>
                      </p>
                    </li>
                  </ul>
                </ContactCard>

                <ContactCard number="03" title="Pomoc i FAQ">
                  <ul className="grid grid-cols-1 gap-x-5 gap-y-2.5 text-[0.9rem] text-zinc-200 sm:grid-cols-2 sm:text-[0.95rem]">
                    {FAQ_ITEMS.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ContactCard>
              </div>
            </div>
          </PageFrame>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
