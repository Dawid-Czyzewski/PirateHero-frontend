import { useTranslation } from 'react-i18next';
import { AUTH_AVATARS, resolveAvatarLabel } from '@/features/auth/authAvatars';
import { ExperienceBar } from '@/components/ui/ExperienceBar';
import type { GameUser } from '@/types/gameUser';

type Props = {
  user: GameUser;
};

export function GameHeaderUserPanel({ user }: Props) {
  const { t } = useTranslation();
  const avatarId = (user.avatarName ?? '').trim().toLowerCase();
  const avatarMatch = AUTH_AVATARS.find(
    (avatar) => avatar.id.toLowerCase() === avatarId || avatar.fileKey.toLowerCase() === avatarId
  );
  const avatarLabel = resolveAvatarLabel(t, user.avatarName);
  const avatarSrc = avatarMatch?.imageSrc ?? AUTH_AVATARS[0]?.imageSrc;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
      <div className="relative shrink-0">
        <img
          src={avatarSrc}
          alt="Avatar"
          className="h-10 w-10 rounded-full border-2 border-primary object-cover shadow-[0_0_10px_hsla(42,90%,50%,0.2)]"
          width={40}
          height={40}
        />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground ring-2 ring-[hsl(220,25%,7%)]">
          {user.level.name}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="min-w-0 truncate text-sm font-bold normal-case tracking-normal text-foreground font-[family-name:var(--font-body)] sm:text-base">
          {user.username}
        </p>
        <div className="mt-0.5 hidden min-w-0 flex-col gap-1.5 sm:mt-1 sm:flex sm:flex-row sm:items-center sm:gap-3">
          <span className="hidden shrink-0 text-xs font-bold text-primary/80 sm:inline">{avatarLabel}</span>
          <ExperienceBar
            current={user.experiencePoints}
            max={user.level.expToNextLevel}
            label={t('exp')}
            className="w-full min-w-0 max-w-[6.5rem] sm:min-w-[8rem] sm:max-w-[14rem] sm:flex-1"
            heightClassName="h-3"
          />
        </div>
      </div>
    </div>
  );
}
