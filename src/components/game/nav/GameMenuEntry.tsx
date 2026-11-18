import Image from "next/image";
import Link from "next/link";
import { ACTIVE, ENTRY, FOCUS_RING, ICON_SIZE, IDLE, LABEL, SOON, type NavLayout } from "@/components/game/nav/navStyles";
import type { GameMenuItem } from "@/modules/game/gameMenu";

type GameMenuEntryProps = {
  item: GameMenuItem;
  active: boolean;
  layout: NavLayout;
};

function MenuIcon({ src, layout, dimmed }: { src: string; layout: NavLayout; dimmed: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      width={96}
      height={96}
      sizes="48px"
      className={`${ICON_SIZE[layout]} object-contain drop-shadow-[0_2px_3px_rgb(0_0_0/0.7)] ${dimmed ? "opacity-70 grayscale-[60%]" : ""}`}
    />
  );
}

export function GameMenuEntry({ item, active, layout }: GameMenuEntryProps) {
  if (!item.available) {
    return (
      <span className={`${ENTRY[layout]} ${SOON}`}>
        <MenuIcon src={item.icon} layout={layout} dimmed />
        <span className={LABEL[layout]}>{item.label}</span>
        <span className="absolute top-0.5 right-0.5 rounded-sm bg-black/80 px-1 font-cond text-[0.6rem] leading-tight font-bold tracking-[.04em] text-gold uppercase">
          Wkrótce
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${ENTRY[layout]} ${active ? ACTIVE : IDLE} ${FOCUS_RING} transition-colors`}
    >
      <MenuIcon src={item.icon} layout={layout} dimmed={false} />
      <span className={LABEL[layout]}>{item.label}</span>
    </Link>
  );
}
