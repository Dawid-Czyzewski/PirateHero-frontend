export type SkinTone = { base: string; shade: string };

export const SKIN_TONES: readonly SkinTone[] = [
  { base: "#f4d2b5", shade: "#d9a986" },
  { base: "#e3b08a", shade: "#c38a63" },
  { base: "#c68a5e", shade: "#a26b43" },
  { base: "#8f5b3a", shade: "#704327" },
  { base: "#5b3a26", shade: "#43291a" },
];

export const PALETTE = {
  outline: "#120a0c",
  blood: "#e1192d",
  bloodDeep: "#a30f1f",
  cloth: "#17171f",
  clothShade: "#0e0e14",
  white: "#f4f1ea",
  hairDark: "#2a1810",
  hairBrown: "#5a3420",
  hairBlond: "#d8b25a",
  ink: "#1d2233",
  scar: "#b5413e",
  mouth: "#4a0d12",
} as const;

export const OUTLINE = {
  stroke: PALETTE.outline,
  strokeWidth: 3,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;
