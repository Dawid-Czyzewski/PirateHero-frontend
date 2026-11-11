import { EMPTY_LAYER, type LayerArt } from "@/components/character/preview/layerArt";
import { OUTLINE, PALETTE } from "@/components/character/preview/palette";

const CAP = "M71 62 Q69 30 100 30 Q131 30 129 62 Q124 45 100 43 Q76 45 71 62 Z";

const Buzz: LayerArt = () => <path d={CAP} fill={PALETTE.hairDark} {...OUTLINE} />;

const Spiky: LayerArt = () => (
  <path
    d="M70 62 Q66 40 76 30 L74 18 L86 26 L90 12 L99 24 L108 10 L112 25 L124 16 L123 30 Q134 40 130 62 Q125 46 100 44 Q76 46 70 62 Z"
    fill={PALETTE.hairBrown}
    {...OUTLINE}
  />
);

const Mohawk: LayerArt = () => (
  <path
    d="M92 46 L90 22 L95 26 L97 12 L101 22 L104 10 L106 24 L110 20 L108 46 Q100 42 92 46 Z"
    fill={PALETTE.blood}
    {...OUTLINE}
  />
);

const SlickBack: LayerArt = () => (
  <g>
    <path d="M70 60 Q68 28 100 27 Q133 28 130 60 Q126 40 100 38 Q76 40 70 60 Z" fill={PALETTE.hairDark} {...OUTLINE} />
    <path d="M84 34 Q100 30 118 36" fill="none" stroke={PALETTE.hairBrown} strokeWidth={3} strokeLinecap="round" />
  </g>
);

const Curly: LayerArt = () => (
  <g fill={PALETTE.hairDark} {...OUTLINE}>
    <circle cx={76} cy={46} r={10} />
    <circle cx={88} cy={34} r={11} />
    <circle cx={102} cy={30} r={11} />
    <circle cx={116} cy={35} r={11} />
    <circle cx={125} cy={47} r={10} />
  </g>
);

const ManBun: LayerArt = () => (
  <g>
    <circle cx={100} cy={22} r={9} fill={PALETTE.hairBrown} {...OUTLINE} />
    <path d={CAP} fill={PALETTE.hairBrown} {...OUTLINE} />
  </g>
);

const Long: LayerArt = () => (
  <g>
    <path d="M68 64 Q66 98 74 104 L78 70 Z M132 64 Q134 98 126 104 L122 70 Z" fill={PALETTE.hairBlond} {...OUTLINE} />
    <path d="M68 66 Q64 28 100 28 Q136 28 132 66 Q122 42 100 42 Q78 42 68 66 Z" fill={PALETTE.hairBlond} {...OUTLINE} />
  </g>
);

export const HAIR_VARIANTS: readonly LayerArt[] = [EMPTY_LAYER, Buzz, Spiky, Mohawk, SlickBack, Curly, ManBun, Long];
