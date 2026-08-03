import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { useForgotPasswordFlow } from '@/features/auth/useForgotPasswordFlow';
import { authInputClassName } from '@/features/auth/authFormStyles';

type ForgotFlow = ReturnType<typeof useForgotPasswordFlow>;

type Props = {
  forgotFlow: ForgotFlow;
  onBackToLogin: () => void;
};

export function AuthForgotPasswordFormSection({ forgotFlow, onBackToLogin }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('passwordResetBackToLogin')}
      </button>

      <p className="text-sm text-muted-foreground">{t('passwordResetIntro')}</p>

      <form onSubmit={forgotFlow.handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="text-sm text-muted-foreground">
            {t('email')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="email"
              value={forgotFlow.email}
              onChange={forgotFlow.handleChange}
              placeholder={t('auth.emailPlaceholder')}
              className={authInputClassName}
            />
          </div>
          {forgotFlow.errors.email ? (
            <p className="text-sm text-destructive">{forgotFlow.errors.email}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={forgotFlow.isSubmitting}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {forgotFlow.isSubmitting ? (
            <>
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              {t('passwordResetSendingLink')}
            </>
          ) : (
            t('passwordResetSendLink')
          )}
        </button>
      </form>
    </div>
  );
}
