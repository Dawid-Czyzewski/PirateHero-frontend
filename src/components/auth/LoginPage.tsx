import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

export function LoginPageView() {
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
            <section
              className="relative w-full max-w-[380px] rounded-xl border-2 border-[#c81e24] bg-gradient-to-b from-[#141519]/95 to-[#0e0f12]/96 px-5 pb-6 pt-5 text-center shadow-[0_0_40px_rgba(225,29,36,0.18)] sm:px-7 sm:pb-7 sm:pt-6 xl:max-w-[420px] xl:px-8 xl:pb-8 xl:pt-7"
              aria-labelledby="login-title"
            >
              <h1 id="login-title" className="mb-5 leading-none sm:mb-6">
                <span className="sr-only">Logowanie</span>
                <Image
                  src="/images/headline-login.png"
                  alt=""
                  width={1232}
                  height={654}
                  priority
                  sizes="(max-width: 640px) 80vw, 280px"
                  className="mx-auto h-auto w-full max-w-[17rem] sm:max-w-[18.5rem]"
                  aria-hidden
                />
              </h1>

              <LoginForm />

              <hr className="my-5 border-0 border-t border-[#2c2d33] sm:my-6" />

              <p className="text-[0.95rem] font-medium leading-relaxed text-white sm:text-base">
                Nie masz konta?
                <Link
                  href="/register"
                  className="mt-1 block text-[0.9rem] text-[#e11d24] transition hover:underline sm:text-[0.95rem]"
                >
                  Stwórz swoją legendę
                </Link>
              </p>
            </section>
          </div>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
