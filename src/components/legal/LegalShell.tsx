import type { ReactNode } from "react";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0a0a0a]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-zinc-300">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
