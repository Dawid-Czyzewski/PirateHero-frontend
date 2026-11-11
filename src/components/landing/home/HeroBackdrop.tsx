import { Embers } from "@/components/landing/home/Embers";

export const HIDDEN_ON_SMALL_DESKTOP = "desk-compact:hidden";

const BEAM = [
  "absolute -top-[6%] z-0 h-[96%] w-[24%] origin-[50%_0] phone:hidden motion-reduce:animate-none",
  "bg-[linear-gradient(rgba(255,236,222,.2),rgba(255,140,110,.07)_55%,rgba(255,90,60,0))]",
  "[clip-path:polygon(44%_0,56%_0,100%_100%,0_100%)]",
].join(" ");

const EMBER_FIELD = [
  "pointer-events-none absolute inset-0 overflow-hidden",
  "phone:[mask-image:radial-gradient(ellipse_75%_45%_at_50%_30%,#000_35%,rgba(0,0,0,.4)_75%,transparent_100%),linear-gradient(transparent_70%,rgba(0,0,0,.5))]",
  "desk:right-auto desk:-left-[3%] desk:w-[58%]",
  "desk:[mask-image:radial-gradient(ellipse_50%_52%_at_50%_50%,#000_40%,rgba(0,0,0,.4)_75%,transparent_100%)]",
].join(" ");

const CORNER_EMBERS = [
  "pointer-events-none absolute z-1 hidden overflow-hidden",
  "desk:-right-[3%] desk:bottom-0 desk:block desk:h-[42%] desk:w-[34%]",
  "desk:[mask-image:radial-gradient(ellipse_70%_70%_at_100%_100%,#000_20%,transparent_100%)]",
].join(" ");

export function HeroBackdrop() {
  return (
    <>
      <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${HIDDEN_ON_SMALL_DESKTOP}`} aria-hidden="true">
        <span className={`${BEAM} left-[10%] animate-beam [transform:rotate(16deg)]`} />
        <span className={`${BEAM} left-[60%] animate-beam-late [transform:rotate(-14deg)]`} />
      </div>
      <div className={`${EMBER_FIELD} z-1`} aria-hidden="true">
        <Embers layer="back" />
      </div>
      <div className={CORNER_EMBERS} aria-hidden="true">
        <Embers layer="mid" />
      </div>
    </>
  );
}

export function HeroForegroundEmbers() {
  return (
    <div className={`${EMBER_FIELD} z-4`} aria-hidden="true">
      <Embers layer="near" />
    </div>
  );
}
