import type { TFunction } from 'i18next';

export type AuthAvatar = {
  id: string;
  fileKey: string;
  imageSrc?: string;
  emojiFallback?: string;
};

import avatar1 from '@/assets/awatars/avatar1.png';
import avatar10 from '@/assets/awatars/avatar10.png';
import avatar2 from '@/assets/awatars/avatar2.png';
import avatar3 from '@/assets/awatars/avatar3.png';
import avatar4 from '@/assets/awatars/avatar4.png';
import avatar5 from '@/assets/awatars/avatar5.png';
import avatar6 from '@/assets/awatars/avatar6.png';
import avatar7 from '@/assets/awatars/avatar7.png';
import avatar8 from '@/assets/awatars/avatar8.png';
import avatar9 from '@/assets/awatars/avatar9.png';

export const AUTH_AVATARS: AuthAvatar[] = [
  { id: 'captain', fileKey: 'avatar1', imageSrc: avatar1, emojiFallback: '🧭' },
  { id: 'boatswain', fileKey: 'avatar2', imageSrc: avatar2, emojiFallback: '⚓' },
  { id: 'navigator', fileKey: 'avatar3', imageSrc: avatar3, emojiFallback: '🧔' },
  { id: 'rogue', fileKey: 'avatar4', imageSrc: avatar4, emojiFallback: '🕵️' },
  { id: 'buccaneer', fileKey: 'avatar5', imageSrc: avatar5, emojiFallback: '🪓' },
  { id: 'admiral', fileKey: 'avatar6', imageSrc: avatar6, emojiFallback: '🧥' },
  { id: 'captainess', fileKey: 'avatar7', imageSrc: avatar7, emojiFallback: '🧭' },
  { id: 'sorceress', fileKey: 'avatar8', imageSrc: avatar8, emojiFallback: '✨' },
  { id: 'scout', fileKey: 'avatar9', imageSrc: avatar9, emojiFallback: '🏹' },
  { id: 'warrior', fileKey: 'avatar10', imageSrc: avatar10, emojiFallback: '🗡️' },
];

export function getAuthAvatarName(t: TFunction, avatar: AuthAvatar): string {
  return t(`avatars.${avatar.id}`);
}

const LEGACY_AVATAR_ALIAS_TO_ID: Record<string, string> = {
  avatar1: 'captain',
  avatar2: 'boatswain',
  avatar3: 'navigator',
  avatar4: 'rogue',
  avatar5: 'buccaneer',
  avatar6: 'admiral',
  avatar7: 'captainess',
  avatar8: 'sorceress',
  avatar9: 'scout',
  avatar10: 'warrior',
  pirate: 'pirate',
  kapitan: 'captain',
  bosman: 'boatswain',
  nawigator: 'navigator',
  lotrzyk: 'rogue',
  bukanier: 'buccaneer',
  kapitanka: 'captainess',
  czarodziejka: 'sorceress',
  zwiadowczyni: 'scout',
  wojowniczka: 'warrior',
  wizard: 'sorceress',
};

export function resolveAvatarLabel(t: TFunction, rawAvatarName: string | null | undefined): string {
  const normalized = (rawAvatarName ?? '').trim().toLowerCase();
  if (!normalized) return t('avatars.pirate');

  const byCatalog = AUTH_AVATARS.find(
    (avatar) => avatar.id.toLowerCase() === normalized || avatar.fileKey.toLowerCase() === normalized
  );
  if (byCatalog) return getAuthAvatarName(t, byCatalog);

  const aliasId = LEGACY_AVATAR_ALIAS_TO_ID[normalized];
  if (aliasId) return t(`avatars.${aliasId}`, { defaultValue: rawAvatarName ?? aliasId });

  return rawAvatarName ?? t('avatars.pirate');
}
