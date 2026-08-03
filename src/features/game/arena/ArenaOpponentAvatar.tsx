import { AUTH_AVATARS } from '@/features/auth/authAvatars';

type Props = { avatarId: string };

export function ArenaOpponentAvatar({ avatarId }: Props) {
  const normalized = avatarId.trim().toLowerCase();
  const match = AUTH_AVATARS.find(
    (a) => a.id.toLowerCase() === normalized || a.fileKey.toLowerCase() === normalized
  );
  const src = match?.imageSrc;
  if (src) {
    return <img src={src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />;
  }
  return (
    <span className="flex h-full w-full items-center justify-center text-2xl" aria-hidden>
      {match?.emojiFallback ?? '🏴‍☠️'}
    </span>
  );
}
