import { OUTLINE, type SkinTone } from "@/components/character/preview/palette";

const ARM =
  "M64 110 Q48 114 46 140 L42 196 Q44 206 56 206 L62 198 L64 150 Q66 128 74 118 Z";

function Arm({ tone, mirrored }: { tone: SkinTone; mirrored: boolean }) {
  return (
    <g transform={mirrored ? "translate(200 0) scale(-1 1)" : undefined}>
      <path d={ARM} fill={tone.base} {...OUTLINE} />
      <path d="M50 150 Q48 175 47 196" fill="none" stroke={tone.shade} strokeWidth={3} strokeLinecap="round" />
      <circle cx={52} cy={209} r={11} fill={tone.base} {...OUTLINE} />
      <path d="M45 206 Q52 202 59 206" fill="none" stroke={tone.shade} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

export function BodyLayer({ tone }: { tone: SkinTone }) {
  return (
    <g>
      <rect x={76} y={238} width={20} height={50} fill={tone.base} {...OUTLINE} />
      <rect x={104} y={238} width={20} height={50} fill={tone.base} {...OUTLINE} />
      <Arm tone={tone} mirrored={false} />
      <Arm tone={tone} mirrored />
      <path d="M62 112 Q100 100 138 112 L136 202 L64 202 Z" fill={tone.base} {...OUTLINE} />
      <rect x={89} y={90} width={22} height={20} fill={tone.shade} {...OUTLINE} />
      <ellipse cx={71} cy={68} rx={6} ry={9} fill={tone.base} {...OUTLINE} />
      <ellipse cx={129} cy={68} rx={6} ry={9} fill={tone.base} {...OUTLINE} />
      <ellipse cx={100} cy={64} rx={29} ry={33} fill={tone.base} {...OUTLINE} />
      <path d="M78 84 Q100 104 122 84" fill="none" stroke={tone.shade} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}
