import { OUTLINE, PALETTE } from "@/components/character/preview/palette";

export function OutfitLayer() {
  return (
    <g>
      <path d="M66 110 Q100 122 134 110 L132 202 Q100 208 68 202 Z" fill={PALETTE.cloth} {...OUTLINE} />
      <path d="M72 196 Q100 202 128 196" fill="none" stroke={PALETTE.blood} strokeWidth={3} />
      <path d="M86 112 Q100 124 114 112" fill="none" stroke={PALETTE.clothShade} strokeWidth={3} />
      <path d="M64 198 L136 198 L140 246 L104 249 L100 228 L96 249 L60 246 Z" fill={PALETTE.blood} {...OUTLINE} />
      <path d="M65 199 L135 199 L136 208 L64 208 Z" fill={PALETTE.bloodDeep} />
      <path d="M68 214 L66 244 M132 214 L134 244" stroke={PALETTE.white} strokeWidth={3} strokeLinecap="round" />
      <rect x={76} y={278} width={20} height={11} fill={PALETTE.white} {...OUTLINE} />
      <rect x={104} y={278} width={20} height={11} fill={PALETTE.white} {...OUTLINE} />
      <path d="M72 289 L98 289 L100 302 L66 302 Q66 292 72 289 Z" fill={PALETTE.cloth} {...OUTLINE} />
      <path d="M102 289 L128 289 Q134 292 134 302 L100 302 Z" fill={PALETTE.cloth} {...OUTLINE} />
      <path d="M68 299 L98 299 M102 299 L132 299" stroke={PALETTE.white} strokeWidth={2} />
    </g>
  );
}
