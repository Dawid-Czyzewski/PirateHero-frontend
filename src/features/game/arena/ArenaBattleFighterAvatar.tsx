import type { FighterAnim } from './arenaTypes';
import { resolveArenaAvatar } from './arenaBattleAvatarUtils';
import { fighterAnimClass } from './arenaBattleAnimations';

type Props = {
  side: 'left' | 'right';
  anim: FighterAnim;
  avatarId: string;
  portraitSrc?: string;
  label: string;
  showAttackFx: boolean;
};

export function ArenaBattleFighterAvatar({
  side,
  anim,
  avatarId,
  portraitSrc,
  label,
  showAttackFx,
}: Props) {
  const fxSide = side === 'left' ? 'right-0' : 'left-0';
  const { src: avatarSrc, emoji } = resolveArenaAvatar(avatarId);
  const src = portraitSrc ?? avatarSrc;

  return (
    <div className={`relative transition-all duration-500 ease-out ${fighterAnimClass(anim, side)}`}>
      <span className="sr-only">{label}</span>
      <div
        className="relative h-28 w-20 overflow-hidden rounded-2xl border-2 border-white/20 bg-black/25 shadow-2xl ring-1 ring-black/40 sm:h-40 sm:w-32"
        style={{ filter: anim === 'hit' ? 'brightness(2) saturate(0.5)' : undefined }}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover object-top" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-5xl" aria-hidden>
            {emoji}
          </span>
        )}
      </div>
      {showAttackFx && (
        <div className={`absolute top-1/3 ${fxSide} text-3xl animate-ping`} aria-hidden>
          ⚔️
        </div>
      )}
    </div>
  );
}
