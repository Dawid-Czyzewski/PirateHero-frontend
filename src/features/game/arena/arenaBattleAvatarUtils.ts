import { AUTH_AVATARS } from '@/features/auth/authAvatars';

export function resolveArenaAvatar(avatarId: string): { src?: string; emoji: string } {
  const normalized = avatarId.trim().toLowerCase();
  const match = AUTH_AVATARS.find(
    (a) => a.id.toLowerCase() === normalized || a.fileKey.toLowerCase() === normalized
  );
  return { src: match?.imageSrc, emoji: match?.emojiFallback ?? '🏴‍☠️' };
}
