import Image from "next/image";
import { CURRENCY_ICON_SRC, type CurrencyIconKey } from "@/modules/character/layerAssets";

export function CurrencyIcon({ currency }: { currency: CurrencyIconKey }) {
  return (
    <Image
      src={CURRENCY_ICON_SRC[currency]}
      alt=""
      width={36}
      height={36}
      sizes="36px"
      className="size-9 shrink-0 object-contain drop-shadow-[0_2px_3px_rgb(0_0_0/0.7)]"
    />
  );
}
