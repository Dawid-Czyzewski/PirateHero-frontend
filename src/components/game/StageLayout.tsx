import type { ReactNode } from "react";

type StageLayoutProps = {
  title: ReactNode;
  stage: ReactNode;
  panelClassName?: string;
  reserveBottomBar?: boolean;
  children: ReactNode;
};

const LAYOUT = [
  "relative z-1 mx-auto grid w-full max-w-[40rem] flex-1 grid-cols-[minmax(0,1fr)] content-start gap-3 px-3 sm:px-4",
  "[grid-template-areas:'title'_'stage'_'panel']",
  "desk:max-w-[min(100%-3rem,88rem)] desk:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] desk:grid-rows-[auto_minmax(0,1fr)] desk:gap-x-[clamp(1rem,2.4vw,2.5rem)] desk:gap-y-1 desk:px-0 desk:pb-4",
  "desk:[grid-template-areas:'stage_title'_'stage_panel']",
].join(" ");

const BOTTOM_SPACE = "pb-6";

const BOTTOM_BAR_SPACE = "pb-[calc(5.5rem+env(safe-area-inset-bottom))]";

const STAGE_SIZE = [
  "[grid-area:stage] h-[clamp(20rem,58svh,34rem)]",
  "desk:h-[max(30rem,calc(100dvh-5rem))] desk:max-h-[60rem]",
].join(" ");

export function StageLayout({ title, stage, panelClassName = "", reserveBottomBar = false, children }: StageLayoutProps) {
  return (
    <main className={`${LAYOUT} ${reserveBottomBar ? BOTTOM_BAR_SPACE : BOTTOM_SPACE}`}>
      <h1 className="relative m-0 mx-auto w-full max-w-[30rem] [grid-area:title] desk:max-w-[min(100%,34rem)] desk:self-end">
        {title}
      </h1>
      <div className={STAGE_SIZE}>{stage}</div>
      <div className={`flex min-w-0 flex-col [grid-area:panel] ${panelClassName}`}>{children}</div>
    </main>
  );
}
