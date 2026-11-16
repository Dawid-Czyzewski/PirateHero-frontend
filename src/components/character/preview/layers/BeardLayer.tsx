import { EMPTY_LAYER, type LayerArt } from "@/components/character/preview/layerArt";
import { OUTLINE, PALETTE } from "@/components/character/preview/palette";

const MUSTACHE = "M87 81 Q100 75 113 81 Q107 85 100 82 Q93 85 87 81 Z";
const MIRROR = "translate(200 0) scale(-1 1)";
const SIDEBURN = "M70 54 L79 54 L80 86 Q73 82 71 74 Z";
const FULL = "M71 68 Q72 106 100 108 Q128 106 129 68 Q124 92 112 92 Q100 96 88 92 Q76 92 71 68 Z";

const Stubble: LayerArt = () => <path d={FULL} fill={PALETTE.outline} opacity={0.22} />;

const Mustache: LayerArt = () => <path d={MUSTACHE} fill={PALETTE.hairDark} {...OUTLINE} strokeWidth={2} />;

const Goatee: LayerArt = () => (
  <g fill={PALETTE.hairDark} {...OUTLINE} strokeWidth={2}>
    <path d={MUSTACHE} />
    <path d="M93 91 Q100 104 107 91 Q100 95 93 91 Z" />
  </g>
);

const Sideburns: LayerArt = () => (
  <g fill={PALETTE.hairDark} {...OUTLINE} strokeWidth={2}>
    <path d={SIDEBURN} />
    <path d={SIDEBURN} transform={MIRROR} />
  </g>
);

const Full: LayerArt = () => (
  <g fill={PALETTE.hairBrown} {...OUTLINE} strokeWidth={2}>
    <path d={FULL} />
    <path d={MUSTACHE} />
  </g>
);

const Long: LayerArt = () => (
  <g fill={PALETTE.hairBrown} {...OUTLINE} strokeWidth={2}>
    <path d="M71 68 Q72 104 92 112 L100 124 L108 112 Q128 104 129 68 Q124 92 112 92 Q100 96 88 92 Q76 92 71 68 Z" />
    <path d={MUSTACHE} />
  </g>
);

const Horseshoe: LayerArt = () => (
  <path
    d="M87 81 Q100 75 113 81 L114 97 L110 97 L109 84 Q100 82 91 84 L90 97 L86 97 Z"
    fill={PALETTE.hairDark}
    {...OUTLINE}
    strokeWidth={2}
  />
);

export const BEARD_VARIANTS: readonly LayerArt[] = [EMPTY_LAYER, Mustache, Goatee, Stubble, Full, Long, Sideburns, Horseshoe];
