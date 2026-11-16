"use client";

import Image from "next/image";
import { CreationStatusLine } from "@/components/character/CreationStatusLine";
import { CreatorActions } from "@/components/character/CreatorActions";
import { AppearancePicker } from "@/components/character/creator/AppearancePicker";
import { CreatorStage } from "@/components/character/creator/CreatorStage";
import { StartingStats } from "@/components/character/creator/StartingStats";
import { Logo } from "@/components/landing/Logo";
import { useAppearance } from "@/modules/character/hooks/useAppearance";
import { useCharacterCreation } from "@/modules/character/hooks/useCharacterCreation";
import { CREATOR_HEADER_SRC } from "@/modules/character/layerAssets";

const ROOT = [
  "relative flex min-h-dvh flex-col overflow-x-clip bg-[#070404] font-cond font-medium text-[#f2efea] antialiased",
  "[--k:calc(min(100vw,560px)/720)] desk:[--k:clamp(0.8px,calc(100vw/1440),1.1px)]",
  "[&_:where(a,button):focus-visible]:outline-3 [&_:where(a,button):focus-visible]:outline-offset-3 [&_:where(a,button):focus-visible]:outline-gold",
].join(" ");

const BACKDROP = [
  "pointer-events-none fixed inset-0 z-0",
  "[background:linear-gradient(rgba(7,4,4,.55),rgba(7,4,4,.35)_30%,rgba(7,4,4,.8)_70%,#070404),url(/assets/fl/backgrounds/bg-mobile.webp)_center_top_/_cover_no-repeat]",
  "desk:[background:radial-gradient(ellipse_80%_75%_at_50%_40%,rgba(7,4,4,.1)_0%,rgba(7,4,4,.45)_62%,rgba(7,4,4,.88)_100%),linear-gradient(rgba(7,4,4,.25),rgba(7,4,4,.45)_65%,rgba(7,4,4,.85)),url(/assets/site/bg-arena-hero-d.webp)_center_35%_/_cover_no-repeat]",
].join(" ");

const LAYOUT = [
  "relative z-1 mx-auto grid w-full max-w-[40rem] flex-1 grid-cols-[minmax(0,1fr)] gap-3 px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-4",
  "[grid-template-areas:'title'_'stage'_'panel']",
  "desk:max-w-[min(100%-3rem,88rem)] desk:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] desk:grid-rows-[auto_minmax(0,1fr)] desk:gap-x-[clamp(1rem,2.4vw,2.5rem)] desk:gap-y-1 desk:px-0 desk:pb-4",
  "desk:[grid-template-areas:'stage_title'_'stage_panel']",
].join(" ");

const STAGE_SIZE = [
  "[grid-area:stage] h-[clamp(20rem,58svh,34rem)]",
  "desk:h-[max(30rem,calc(100dvh-5rem))] desk:max-h-[60rem]",
].join(" ");

export function CharacterCreator({ nick }: { nick: string }) {
  const editor = useAppearance();
  const creation = useCharacterCreation();

  return (
    <div className={ROOT}>
      <div className={BACKDROP} aria-hidden="true" />
      <header className="relative z-2 mx-auto flex w-full max-w-[40rem] items-center justify-between gap-3 px-3 pt-3 pb-1 sm:px-4 desk:max-w-[min(100%-3rem,88rem)] desk:px-0 desk:pt-3 desk:pb-2">
        <Logo />
        <p className="m-0 font-cond text-xs font-bold tracking-[.18em] text-gold uppercase sm:text-sm">Kreator zawodnika</p>
      </header>
      <main className={LAYOUT}>
        <h1 className="relative m-0 mx-auto w-full max-w-[30rem] [grid-area:title] desk:max-w-[min(100%,34rem)] desk:self-end">
          <span className="sr-only">Stwórz swojego freaka</span>
          <Image
            src={CREATOR_HEADER_SRC}
            alt=""
            width={1200}
            height={490}
            priority
            className="mx-auto h-auto w-[min(100%,calc((100dvh-30rem)*1.6))] min-w-[60%] animate-hero-in motion-reduce:animate-none desk:w-[min(100%,max(14rem,calc((100dvh-40rem)*1.8)))] desk:min-w-0"
          />
        </h1>
        <div className={STAGE_SIZE}>
          <CreatorStage nick={nick} appearance={editor.appearance} rolls={editor.rolls} />
        </div>
        <div className="fl-panel flex min-w-0 flex-col gap-3 p-[calc(26*var(--k))] [grid-area:panel] desk:gap-[clamp(0.4rem,1.3vh,0.9rem)] desk:p-[calc(30*var(--k))]">
          <AppearancePicker
            appearance={editor.appearance}
            activePart={editor.activePart}
            selectPart={editor.selectPart}
            choose={editor.choose}
            errors={creation.errors}
          />
          <StartingStats />
          <CreationStatusLine status={creation.status} onRetry={() => void creation.submit(editor.appearance)} />
          <CreatorActions
            creating={creation.submitting}
            onRandomize={editor.randomize}
            onCreate={() => void creation.submit(editor.appearance)}
          />
        </div>
      </main>
    </div>
  );
}
