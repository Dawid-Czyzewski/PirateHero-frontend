import { EMPTY_LAYER, type LayerArt } from "@/components/character/preview/layerArt";
import { PALETTE } from "@/components/character/preview/palette";

const INK = { fill: "none", stroke: PALETTE.ink, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MIRROR = "translate(200 0) scale(-1 1)";

const TRIBAL = "M48 160 L56 168 L49 176 L57 184 L50 192 M58 150 L52 158";

const LeftTribal: LayerArt = () => <path d={TRIBAL} {...INK} />;

const BothTribal: LayerArt = () => (
  <g>
    <path d={TRIBAL} {...INK} />
    <path d={TRIBAL} {...INK} transform={MIRROR} />
  </g>
);

const NeckStar: LayerArt = () => (
  <path d="M100 95 L102.5 100 L108 100.5 L104 104 L105 109 L100 106.5 L95 109 L96 104 L92 100.5 L97.5 100 Z" fill={PALETTE.ink} opacity={0.85} />
);

const ArmCrown: LayerArt = () => (
  <path d="M141 140 L141 128 L146 134 L150 124 L154 134 L159 128 L158 140 Z" {...INK} transform="translate(-2 4)" />
);

const RightSleeve: LayerArt = () => (
  <g transform={MIRROR}>
    <path d="M47 130 L64 124 M46 146 L64 140 M45 162 L62 158 M44 178 L60 176 M43 192 L58 192" {...INK} strokeWidth={4} />
  </g>
);

const Flames: LayerArt = () => (
  <g>
    <path d="M47 194 Q44 180 52 168 Q52 178 57 176 Q55 166 60 156 Q64 172 58 194 Z" fill={PALETTE.blood} opacity={0.9} />
    <path d="M47 194 Q44 180 52 168 Q52 178 57 176 Q55 166 60 156 Q64 172 58 194 Z" {...INK} strokeWidth={1.5} />
  </g>
);

const Teardrop: LayerArt = () => <path d="M86 73 Q84 77 86 79 Q88 77 86 73 Z" fill={PALETTE.ink} />;

export const TATTOO_VARIANTS: readonly LayerArt[] = [
  EMPTY_LAYER,
  LeftTribal,
  BothTribal,
  NeckStar,
  ArmCrown,
  RightSleeve,
  Flames,
  Teardrop,
];
