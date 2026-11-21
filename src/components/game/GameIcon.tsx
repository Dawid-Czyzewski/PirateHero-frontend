import Image from "next/image";

export type GameIconSize = 24 | 28 | 32 | 36 | 48;

const SIZE_CLASS: Record<GameIconSize, string> = {
  24: "size-6",
  28: "size-7",
  32: "size-8",
  36: "size-9",
  48: "size-12",
};

type GameIconProps = {
  src: string;
  size: GameIconSize;
};

export function GameIcon({ src, size }: GameIconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className={`${SIZE_CLASS[size]} shrink-0 object-contain drop-shadow-[0_2px_3px_rgb(0_0_0/0.7)]`}
    />
  );
}
