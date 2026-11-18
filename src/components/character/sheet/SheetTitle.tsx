import { ImageTitle } from "@/components/game/ImageTitle";
import { SHEET_HEADER } from "@/modules/character/layerAssets";

const SHEET_TITLE_SIZE = "w-[min(100%,20rem)] desk:w-[min(100%,26rem)]";

export function SheetTitle() {
  return <ImageTitle label="Twoja postać" art={SHEET_HEADER} className={SHEET_TITLE_SIZE} />;
}
