import Image from "next/image";
import { PageFrame } from "@/components/landing/PageFrame";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ContactCard } from "@/components/legal/ContactCard";
import { ContactForm } from "@/components/legal/ContactForm";
import {
  IconDiscord,
  IconHandshake,
  IconMail,
} from "@/components/legal/ContactIcons";

const FAQ_ITEMS = [
  "Problem z rubinami",
  "Odzyskiwanie konta",
  "Problem z logowaniem",
  "Płatności i zakupy",
  "Zgłoszenie błędu",
  "Ban / fair play",
];

export function ContactPageView() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-x-clip overflow-y-clip bg-[#0a0a0a]">
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
          className="pointer-events-none absolute bottom-0 right-[-4%] z-[5] hidden h-[min(88vh,820px)] w-[min(42vw,580px)] 2xl:right-[-2%] 2xl:block"
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
                    <li className="flex items-start gap-3">
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
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600"
                          aria-hidden
                        />
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
