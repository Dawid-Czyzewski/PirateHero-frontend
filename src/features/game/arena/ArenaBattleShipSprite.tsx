import type { FighterAnim } from './arenaTypes';
import { fighterAnimClass } from './arenaBattleAnimations';

type Props = {
  side: 'left' | 'right';
  anim: FighterAnim;
  label: string;
  showAttackFx: boolean;
  variant: 'friendly' | 'hostile';
};

function ShipHullSvg({ variant }: { variant: 'friendly' | 'hostile' }) {
  const hullFill = variant === 'friendly' ? 'hsl(160 38% 32%)' : 'hsl(350 42% 36%)';
  const sailStroke = variant === 'friendly' ? 'hsl(158 55% 70%)' : 'hsl(350 52% 78%)';

  return (
    <svg
      viewBox="0 0 140 100"
      className="h-24 w-auto max-w-[8.5rem] drop-shadow-xl sm:h-28"
      aria-hidden
    >
      <path
        d="M8 72 Q28 88 72 92 Q112 88 134 74 L132 62 Q98 74 72 76 Q42 74 14 62 Z"
        fill={hullFill}
        stroke="rgba(255,255,255,.18)"
        strokeWidth={1}
      />
      <path d="M12 62 L132 62" stroke="rgba(255,255,255,.25)" strokeWidth={1} />
      <path
        d="M68 20 L72 92 M68 24 L118 62 M68 32 L108 74"
        fill="none"
        stroke={sailStroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M56 76 L132 74 L134 74 L138 76 L132 80 L56 78 Z"
        fill="rgba(15,23,42,.55)"
      />
      <circle cx={128} cy={76} r={3} fill="hsl(45 90% 55%)" opacity={0.9} />
    </svg>
  );
}

export function ArenaBattleShipSprite({ side, anim, label, showAttackFx, variant }: Props) {
  const mirror = side === 'right';
  const borderRing =
    variant === 'friendly'
      ? 'ring-emerald-500/55 ring-offset-4 ring-offset-black/20'
      : 'ring-rose-500/50 ring-offset-4 ring-offset-black/20';

  return (
    <div className="flex flex-col items-center">
      <span className="sr-only">{label}</span>
      <div
        className={`relative transition-all duration-500 ease-out ${fighterAnimClass(anim, side)}`}
      >
        <div className={anim === 'idle' ? 'animate-ship-rock' : ''}>
          <div
            className={`rounded-2xl border-2 border-white/10 bg-black/35 p-2 shadow-2xl ring-1 ${borderRing}`}
            style={{
              transform: mirror ? 'scaleX(-1)' : undefined,
              filter: anim === 'hit' ? 'brightness(1.45) saturate(0.85)' : undefined,
            }}
          >
            <ShipHullSvg variant={variant} />
          </div>
        </div>
        {showAttackFx ? (
          <div
            className={`pointer-events-none absolute bottom-6 z-30 h-2 w-10 rounded-full bg-amber-200/95 blur-[2px] animate-pulse ${
              side === 'left' ? 'right-0 translate-x-1/4' : 'left-0 -translate-x-1/4'
            }`}
            aria-hidden
          />
        ) : null}
      </div>
      <p
        className="mt-2 max-w-[10rem] truncate text-center text-[11px] font-semibold uppercase leading-tight tracking-wide text-white drop-shadow-md sm:text-xs"
        title={label}
      >
        {label}
      </p>
    </div>
  );
}
