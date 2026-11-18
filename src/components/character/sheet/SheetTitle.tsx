import { ImageTitle } from "@/components/game/ImageTitle";
import { SHEET_HEADER } from "@/modules/character/layerAssets";

const SHEET_TITLE_SIZE = "w-[min(100%,11.5rem)] desk:w-[min(100%,16rem)]";

export function SheetTitle() {
  return <ImageTitle label="Twoja postać" art={SHEET_HEADER} className={SHEET_TITLE_SIZE} />;
}
