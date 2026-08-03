import { Anchor, ArrowLeft, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAuthAvatarName } from '@/features/auth/authAvatars';
import type { RegisterFlow } from '@/features/auth/components/register/registerFlowTypes';

type RegisterAvatarStepProps = {
  registerFlow: RegisterFlow;
};

export function RegisterAvatarStep({ registerFlow }: RegisterAvatarStepProps) {
  const { t } = useTranslation();
  const selectedAvatarId = registerFlow.formData.avatarName;

  return (
    <>
      <div className="space-y-3 text-center">
        <div className="mx-auto flex max-w-[220px] items-center justify-center gap-3 text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
            <Check className="h-4 w-4" />
          </div>
          <div className="h-0.5 flex-1 bg-primary/70" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
            2
          </div>
        </div>
        <h3 className="font-display text-3xl font-bold tracking-wider text-primary">
          {t('registerAvatarTitle')}
        </h3>
        <p className="text-sm text-muted-foreground">{t('registerAvatarSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {registerFlow.avatars.map((avatar) => {
          const selected = selectedAvatarId === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => registerFlow.selectAvatar(avatar.id)}
              className={`rounded-lg border bg-muted/40 p-3 text-center transition-all cursor-pointer ${
                selected
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {avatar.imageSrc ? (
                <img
                  src={avatar.imageSrc}
                  alt=""
                  width={88}
                  height={88}
                  className="mx-auto mb-2 h-16 w-16 rounded-md object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="mb-2 text-4xl" aria-hidden>
                  {avatar.emojiFallback ?? '🏴‍☠️'}
                </div>
              )}
              <div className="font-display text-sm tracking-wide text-foreground uppercase">
                {getAuthAvatarName(t, avatar)}
              </div>
            </button>
          );
        })}
      </div>
      {registerFlow.errors.avatarName && (
        <p className="text-sm text-destructive">{registerFlow.errors.avatarName}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={registerFlow.backToCredentialsStep}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-muted px-4 py-3 font-display text-sm tracking-wide text-foreground uppercase transition hover:border-primary/40"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </button>
        <button
          type="submit"
          disabled={registerFlow.isSubmitting}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-display text-sm tracking-wide text-primary-foreground uppercase transition glow-gold hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerFlow.isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              {t('loadingRegister')}
            </>
          ) : (
            <>
              <Anchor className="h-4 w-4 shrink-0" />
              {t('registerStartGame')}
            </>
          )}
        </button>
      </div>
    </>
  );
}
