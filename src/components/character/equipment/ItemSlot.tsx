import Image from "next/image";
import { EQUIPMENT_SLOT_SRC } from "@/modules/character/layerAssets";

type ItemSlotProps = {
  description: string;
  caption?: string;
  className?: string;
};

export function ItemSlot({ description, caption, className = "" }: ItemSlotProps) {
  return (
    <li className={`grid min-w-0 justify-items-center gap-1 text-center ${className}`}>
      <span className="relative block aspect-square w-full min-w-11">
        <Image src={EQUIPMENT_SLOT_SRC} alt="" fill sizes="96px" className="object-contain opacity-85" />
      </span>
      {caption ? (
        <span
          className="font-cond text-[0.85rem] leading-tight font-bold tracking-[.03em] [overflow-wrap:anywhere] text-[#c9c3bb] uppercase sm:text-sm"
          aria-hidden="true"
        >
          {caption}
        </span>
      ) : null}
      <span className="sr-only">{description}</span>
    </li>
  );
}
