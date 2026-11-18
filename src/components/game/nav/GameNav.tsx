"use client";

import { usePathname } from "next/navigation";
import { BottomBar } from "@/components/game/nav/BottomBar";
import { SideMenu } from "@/components/game/nav/SideMenu";

export function GameNav() {
  const pathname = usePathname();

  return (
    <>
      <SideMenu pathname={pathname} />
      <BottomBar pathname={pathname} />
    </>
  );
}
