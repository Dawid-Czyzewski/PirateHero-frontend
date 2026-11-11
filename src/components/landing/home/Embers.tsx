const LAYERS = {
  back: {
    vars: "[--img:url(/assets/site/fx/embers-back.webp)] [--t:880px] [--dur:34s] [--tw:5s] [--o1:.8]",
    rise: "animate-rise",
  },
  mid: {
    vars: "[--img:url(/assets/site/fx/embers-mid.webp)] [--t:720px] [--dur:26s] [--tw:4.4s] [--o1:.75]",
    rise: "animate-rise",
  },
  near: {
    vars: "[--img:url(/assets/site/fx/embers-near.webp)] [--t:1100px] [--dur:14s] [--tw:3.2s] [--o1:.65]",
    rise: "animate-rise-late",
  },
} as const;

export type EmberLayer = keyof typeof LAYERS;

export function Embers({ layer }: { layer: EmberLayer }) {
  const { vars, rise } = LAYERS[layer];

  return (
    <span className={`absolute inset-0 animate-twinkle opacity-(--o1) motion-reduce:animate-none ${vars}`}>
      <i
        className={`absolute inset-x-0 top-0 h-[calc(100%+var(--t))] [background:var(--img)_0_0_/_var(--t)_var(--t)_repeat] will-change-transform motion-reduce:animate-none ${rise}`}
      />
    </span>
  );
}
