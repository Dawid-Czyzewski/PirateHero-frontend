import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegisterFlow } from '@/features/auth/components/register/registerFlowTypes';
import {
  authInputClassName,
  authInputWithToggleClassName,
} from '@/features/auth/authFormStyles';

type RegisterCredentialsStepProps = {
  registerFlow: RegisterFlow;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function RegisterCredentialsStep({
  registerFlow,
  showPassword,
  onTogglePassword,
}: RegisterCredentialsStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-3 text-center">
        <div className="mx-auto flex max-w-[220px] items-center justify-center gap-3 text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
            1
          </div>
          <div className="h-0.5 flex-1 bg-primary/40" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-bold text-primary">
            2
          </div>
        </div>
        <h3 className="font-display text-3xl font-bold tracking-wider text-primary">
          {t('registerCredentialsTitle')}
        </h3>
        <p className="text-sm text-muted-foreground">{t('registerCredentialsSubtitle')}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="auth-username" className="text-sm text-muted-foreground">
          {t('username')}
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="auth-username"
            type="text"
            name="username"
            autoComplete="username"
            value={registerFlow.formData.username}
            onChange={registerFlow.handleChange}
            placeholder={t('auth.pirateNamePlaceholder')}
            className={authInputClassName}
          />
        </div>
        {registerFlow.errors.username && (
          <p className="text-sm text-destructive">{registerFlow.errors.username}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="auth-reg-email" className="text-sm text-muted-foreground">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="auth-reg-email"
            type="email"
            name="email"
            autoComplete="email"
            value={registerFlow.formData.email}
            onChange={registerFlow.handleChange}
            placeholder={t('auth.emailPlaceholder')}
            className={authInputClassName}
          />
        </div>
        {registerFlow.errors.email && (
          <p className="text-sm text-destructive">{registerFlow.errors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="auth-reg-password" className="text-sm text-muted-foreground">
          {t('password')}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="auth-reg-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="new-password"
            value={registerFlow.formData.password}
            onChange={registerFlow.handleChange}
            placeholder="••••••••"
            className={authInputWithToggleClassName}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {registerFlow.errors.password && (
          <p className="text-sm text-destructive">{registerFlow.errors.password}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="auth-password-repeat" className="text-sm text-muted-foreground">
          {t('repeatPassword')}
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="auth-password-repeat"
            type={showPassword ? 'text' : 'password'}
            name="passwordRepeat"
            autoComplete="new-password"
            value={registerFlow.formData.passwordRepeat}
            onChange={registerFlow.handleChange}
            placeholder="••••••••"
            className={authInputClassName}
          />
        </div>
        {registerFlow.errors.passwordRepeat && (
          <p className="text-sm text-destructive">{registerFlow.errors.passwordRepeat}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="rulesAccepted"
          id="auth-rules"
          checked={registerFlow.formData.rulesAccepted}
          onChange={registerFlow.handleChange}
          className="mt-1 h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="auth-rules" className="cursor-pointer text-xs leading-snug text-muted-foreground">
          {t('acceptTerms')}{' '}
          <a href="/terms" className="font-medium text-primary hover:underline">
            {t('termsOfService')}
          </a>{' '}
          {t('and')}{' '}
          <a href="/privacy" className="font-medium text-primary hover:underline">
            {t('privacyPolicy')}
          </a>
        </label>
      </div>
      {registerFlow.errors.rulesAccepted && (
        <p className="text-sm text-destructive">{registerFlow.errors.rulesAccepted}</p>
      )}

      <button
        type="submit"
        disabled={registerFlow.isSubmitting}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-sm font-bold text-primary-foreground transition-colors glow-gold hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{t('registerStepContinue')}</span>
        <span className="font-normal">1/2</span>
      </button>
    </>
  );
}
