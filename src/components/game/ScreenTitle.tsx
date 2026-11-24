import { ImageTitle } from "@/components/game/ImageTitle";

type TitleArt = { src: string; width: number; height: number };

const SCREEN_TITLE_SIZE = "w-[min(100%,15rem)] desk:w-[min(100%,20rem)]";

export function ScreenTitle({ label, art }: { label: string; art: TitleArt }) {
  return (
    <h1 className="m-0">
      <ImageTitle label={label} art={art} className={SCREEN_TITLE_SIZE} />
    </h1>
  );
}
