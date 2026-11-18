import { GameMenuEntry } from "@/components/game/nav/GameMenuEntry";
import type { NavLayout } from "@/components/game/nav/navStyles";
import { isCurrentPage, type GameMenuItem } from "@/modules/game/gameMenu";

type MenuListProps = {
  items: readonly GameMenuItem[];
  pathname: string;
  layout: NavLayout;
  className: string;
};

export function MenuList({ items, pathname, layout, className }: MenuListProps) {
  return (
    <ul className={`m-0 list-none p-0 ${className}`}>
      {items.map((item) => (
        <li key={item.id} className="min-w-0">
          <GameMenuEntry item={item} active={isCurrentPage(item, pathname)} layout={layout} />
        </li>
      ))}
    </ul>
  );
}
