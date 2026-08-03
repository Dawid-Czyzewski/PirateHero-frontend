import { resolveArenaAvatar } from './arenaBattleAvatarUtils';

type Props = {
  avatarId: string;
  portraitSrc?: string;
  borderClass: string;
};

export function ArenaBattleAvatarChip({ avatarId, portraitSrc, borderClass }: Props) {
  const { src: avatarSrc, emoji } = resolveArenaAvatar(avatarId);
  const src = portraitSrc ?? avatarSrc;
  return (
    <div
      className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 bg-black/40 shadow-md sm:h-10 sm:w-10 ${borderClass}`}
      aria-hidden
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover object-top" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-lg sm:text-xl">{emoji}</span>
      )}
    </div>
  );
}
