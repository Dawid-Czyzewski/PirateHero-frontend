import { Anchor, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { useLoginFlow } from '@/features/auth/useLoginFlow';
import { authInputClassName, authInputWithToggleClassName } from '@/features/auth/authFormStyles';

type LoginFlow = ReturnType<typeof useLoginFlow>;

type AuthLoginFormSectionProps = {
  loginFlow: LoginFlow;
  showPassword: boolean;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
};

export function AuthLoginFormSection({
  loginFlow,
  showPassword,
  onTogglePassword,
  onForgotPassword,
}: AuthLoginFormSectionProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={loginFlow.handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="auth-email" className="text-sm text-muted-foreground">
          {t('email')}
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="auth-email"
            type="email"
            name="email"
            autoComplete="email"
            value={loginFlow.formData.email}
            onChange={loginFlow.handleChange}
            placeholder={t('auth.emailPlaceholder')}
            className={authInputClassName}
          />
        </div>
        {loginFlow.errors.email && (
          <p className="text-sm text-destructive">{loginFlow.errors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="auth-password" className="text-sm text-muted-foreground">
          {t('password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="auth-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            value={loginFlow.formData.password}
            onChange={loginFlow.handleChange}
            placeholder="••••••••"
            className={authInputWithToggleClassName}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {loginFlow.errors.password && (
          <p className="text-sm text-destructive">{loginFlow.errors.password}</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-primary hover:underline cursor-pointer"
        >
          {t('auth.forgotPassword')}
        </button>
      </div>

      <button
        type="submit"
        disabled={loginFlow.isSubmitting}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90 transition-colors glow-gold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loginFlow.isSubmitting ? (
          <>
            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            {t('loadingLogin')}
          </>
        ) : (
          <>
            <Anchor className="h-4 w-4 shrink-0" />
            {t('login')}
          </>
        )}
      </button>
    </form>
  );
}
