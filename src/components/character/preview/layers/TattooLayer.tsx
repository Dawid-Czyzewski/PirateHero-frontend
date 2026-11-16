import { EMPTY_LAYER, type LayerArt } from "@/components/character/preview/layerArt";
import { PALETTE } from "@/components/character/preview/palette";

const INK = { fill: "none", stroke: PALETTE.ink, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MIRROR = "translate(200 0) scale(-1 1)";

const WING = "M98 118 Q91 107 81 111 Q86 113 84 116 Q89 115 89 119 Q93 116 98 118 Z";

const Teardrop: LayerArt = () => <path d="M86 73 Q84 77 86 79 Q88 77 86 73 Z" fill={PALETTE.ink} />;

const NeckLines: LayerArt = () => <path d="M93 95 L93 107 M97 95 L97 107 M101 95 L101 107 M105 95 L105 107 M90 104 L108 98" {...INK} />;

const ChestStar: LayerArt = () => (
  <path
    d="M100 109 L102.5 114 L108 114.5 L104 118 L105 123 L100 120.5 L95 123 L96 118 L92 114.5 L97.5 114 Z"
    fill={PALETTE.ink}
    opacity={0.85}
  />
);

const Wings: LayerArt = () => (
  <g fill={PALETTE.ink} opacity={0.85}>
    <path d={WING} />
    <path d={WING} transform={MIRROR} />
  </g>
);

const TempleTribal: LayerArt = () => <path d="M75 54 L80 57 L76 60 L81 63 L77 66" {...INK} />;

const BarbedWire: LayerArt = () => (
  <path d="M89 101 L111 101 M91 98 L95 104 M95 98 L91 104 M98 98 L102 104 M102 98 L98 104 M105 98 L109 104 M109 98 L105 104" {...INK} />
);

const DoubleX: LayerArt = () => (
  <path d="M111 74 L116 79 M116 74 L111 79 M118 74 L123 79 M123 74 L118 79" {...INK} strokeWidth={2.2} />
);

export const TATTOO_VARIANTS: readonly LayerArt[] = [
  EMPTY_LAYER,
  Teardrop,
  NeckLines,
  ChestStar,
  Wings,
  TempleTribal,
  BarbedWire,
  DoubleX,
];
