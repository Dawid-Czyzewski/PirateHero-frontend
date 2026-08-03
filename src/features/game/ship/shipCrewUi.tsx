import { Crown } from 'lucide-react';
import { AUTH_AVATARS } from '@/features/auth/authAvatars';
import type { Member } from '@/features/game/ship/shipTypes';

export function resolveCrewAvatarSrc(avatarName: string | undefined): string | undefined {
  const raw = (avatarName ?? '').trim().toLowerCase();
  const found = AUTH_AVATARS.find(
    (a) => a.id.toLowerCase() === raw || a.fileKey.toLowerCase() === raw
  );
  return found?.imageSrc;
}

export function CrewMemberAvatar({ avatarName, name }: { avatarName?: string; name: string }) {
  const src = resolveCrewAvatarSrc(avatarName) ?? AUTH_AVATARS[0]?.imageSrc;
  return (
    <img
      src={src}
      alt={name}
      className="h-11 w-11 shrink-0 rounded-full border-2 border-primary/40 object-cover"
    />
  );
}

export function RoleIconByNickname({ role }: { role: Member['role'] }) {
  if (role !== 'OWNER') return null;
  return <Crown className="h-4 w-4 shrink-0 text-primary" aria-hidden />;
}

export function canKickMember(viewer: Member | undefined, target: Member): boolean {
  if (!viewer || viewer.userId === target.userId) return false;
  if (viewer.role === 'OWNER') return true;
  if (viewer.role === 'MANAGER' && target.role === 'MEMBER') return true;
  return false;
}
