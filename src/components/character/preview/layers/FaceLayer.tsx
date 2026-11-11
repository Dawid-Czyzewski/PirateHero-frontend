import type { LayerArt } from "@/components/character/preview/layerArt";
import { OUTLINE, PALETTE } from "@/components/character/preview/palette";

type Brows = "flat" | "angry" | "raised";
type Eyes = "dot" | "narrow" | "wide" | "happy";
type Mouth = "smirk" | "grin" | "flat" | "frown" | "shout";

type FaceShape = { brows: Brows; eyes: Eyes; mouth: Mouth; scar?: boolean };

const STROKE = { ...OUTLINE, fill: "none" } as const;

const BROWS: Record<Brows, string> = {
  flat: "M80 56 L94 55 M106 55 L120 56",
  angry: "M80 53 L95 58 M105 58 L120 53",
  raised: "M80 55 Q87 49 94 53 M106 56 L120 56",
};

function EyesArt({ eyes }: { eyes: Eyes }) {
  switch (eyes) {
    case "dot":
      return (
        <g fill={PALETTE.outline}>
          <circle cx={88} cy={66} r={2.8} />
          <circle cx={112} cy={66} r={2.8} />
        </g>
      );
    case "narrow":
      return <path d="M83 66 L93 67 M107 67 L117 66" {...STROKE} />;
    case "happy":
      return <path d="M83 68 Q88 62 93 68 M107 68 Q112 62 117 68" {...STROKE} />;
    case "wide":
      return (
        <g>
          <ellipse cx={88} cy={66} rx={5} ry={4} fill={PALETTE.white} {...OUTLINE} strokeWidth={2} />
          <ellipse cx={112} cy={66} rx={5} ry={4} fill={PALETTE.white} {...OUTLINE} strokeWidth={2} />
          <circle cx={88} cy={66} r={2} fill={PALETTE.outline} />
          <circle cx={112} cy={66} r={2} fill={PALETTE.outline} />
        </g>
      );
  }
}

function MouthArt({ mouth }: { mouth: Mouth }) {
  switch (mouth) {
    case "smirk":
      return <path d="M91 85 Q99 88 108 82" {...STROKE} />;
    case "flat":
      return <path d="M92 86 L108 86" {...STROKE} />;
    case "frown":
      return <path d="M92 88 Q100 83 108 88" {...STROKE} />;
    case "grin":
      return <path d="M90 83 Q100 93 110 83 Z" fill={PALETTE.white} {...OUTLINE} strokeWidth={2.5} />;
    case "shout":
      return <ellipse cx={100} cy={87} rx={6} ry={5} fill={PALETTE.mouth} {...OUTLINE} strokeWidth={2.5} />;
  }
}

function face({ brows, eyes, mouth, scar = false }: FaceShape): LayerArt {
  return function FaceArt() {
    return (
      <g>
        <path d={BROWS[brows]} {...STROKE} strokeWidth={3.5} />
        <EyesArt eyes={eyes} />
        <path d="M100 69 L97 78 L103 78" {...STROKE} strokeWidth={2} />
        <MouthArt mouth={mouth} />
        {scar ? <path d="M113 52 L119 74 M114 60 L119 58 M116 67 L121 65" fill="none" stroke={PALETTE.scar} strokeWidth={2} /> : null}
      </g>
    );
  };
}

export const FACE_VARIANTS: readonly LayerArt[] = [
  face({ brows: "flat", eyes: "dot", mouth: "smirk" }),
  face({ brows: "angry", eyes: "narrow", mouth: "flat" }),
  face({ brows: "raised", eyes: "dot", mouth: "grin" }),
  face({ brows: "angry", eyes: "dot", mouth: "frown" }),
  face({ brows: "angry", eyes: "wide", mouth: "shout" }),
  face({ brows: "flat", eyes: "narrow", mouth: "smirk", scar: true }),
  face({ brows: "raised", eyes: "happy", mouth: "grin" }),
  face({ brows: "flat", eyes: "narrow", mouth: "flat", scar: true }),
];
