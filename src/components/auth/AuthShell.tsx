import Image from "next/image";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

export function AuthShell({ children }: { children: ReactNode }) {
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(0,0,0,0.15)_20%,rgba(0,0,0,0.65)_85%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/40" />
        </div>

        <div
          className="pointer-events-none absolute bottom-[-2.5rem] left-0 z-[5] hidden h-[min(82vh,620px)] w-[min(38vw,400px)] lg:block xl:bottom-[-3rem] xl:left-[4%] xl:h-[min(90vh,800px)] xl:w-[min(46vw,620px)] 2xl:left-[7%] 2xl:h-[min(94vh,900px)] 2xl:w-[min(50vw,720px)]"
          aria-hidden
        >
          <Image
            src="/images/hero-fighter-v4.png"
            alt=""
            width={605}
            height={676}
            priority
            sizes="(max-width: 1023px) 0px, (max-width: 1279px) 400px, (max-width: 1535px) 620px, 720px"
            className="h-full w-full scale-90 object-contain object-bottom object-left drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] xl:scale-[0.97]"
          />
        </div>

        <SiteHeader />

        <main className="relative z-20 flex min-h-screen flex-col justify-center pb-10 pt-20 md:pb-12 md:pt-24 xl:pb-14 xl:pt-28">
          <div className="mx-auto flex w-full max-w-6xl justify-center px-4 sm:px-8 lg:justify-end lg:pl-[min(42vw,440px)] lg:pr-6 xl:pl-[min(48vw,560px)] xl:pr-12 2xl:pr-16">
            <div className="w-full max-w-[380px] xl:max-w-[420px]">{children}</div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
