import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Modal from '@/components/modal/Modal';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useLoginFlow } from '@/features/auth/useLoginFlow';
import { useRegisterFlow } from '@/features/auth/useRegisterFlow';
import { AuthFormFooterLink } from '@/features/auth/components/AuthFormFooterLink';
import { AuthHeroColumn } from '@/features/auth/components/AuthHeroColumn';
import { AuthLoginFormSection } from '@/features/auth/components/AuthLoginFormSection';
import { AuthForgotPasswordFormSection } from '@/features/auth/components/AuthForgotPasswordFormSection';
import { useForgotPasswordFlow } from '@/features/auth/useForgotPasswordFlow';
import { AuthMobileBrand } from '@/features/auth/components/AuthMobileBrand';
import { AuthModeTabs } from '@/features/auth/components/AuthModeTabs';
import { AuthRegisterFormSection } from '@/features/auth/components/AuthRegisterFormSection';

function authTabsShowLogin(searchParams: URLSearchParams): boolean {
  const mode = searchParams.get('mode');
  if (mode === 'register' || mode === 'signup') return false;
  if (mode === 'login' || mode === 'signin') return true;
  return true;
}

export default function AuthPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  usePageMeta({
    title: t('auth.seoTitle'),
    description: t('auth.seoDescription'),
  });
  const [isLogin, setIsLogin] = useState(() => authTabsShowLogin(searchParams));

  useEffect(() => {
    setIsLogin(authTabsShowLogin(searchParams));
  }, [searchParams]);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const loginFlow = useLoginFlow();
  const registerFlow = useRegisterFlow();
  const forgotFlow = useForgotPasswordFlow();

  const switchMode = (nextIsLogin: boolean) => {
    loginFlow.resetModalState();
    registerFlow.resetModalState();
    forgotFlow.resetForm();
    forgotFlow.closeModal();
    setShowForgotPassword(false);
    setIsLogin(nextIsLogin);
  };

  return (
    <div className="flex flex-1 min-h-0 w-full bg-background">
      <AuthHeroColumn />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <AuthMobileBrand />

          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {showForgotPassword
                ? t('passwordResetPage.title')
                : isLogin
                  ? t('auth.welcomeBack')
                  : t('auth.createAccount')}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {showForgotPassword
                ? t('passwordResetIntro')
                : isLogin
                  ? t('auth.subtitleLogin')
                  : t('auth.subtitleRegister')}
            </p>
          </div>

          {showForgotPassword ? (
            <AuthForgotPasswordFormSection
              forgotFlow={forgotFlow}
              onBackToLogin={() => {
                forgotFlow.resetForm();
                setShowForgotPassword(false);
              }}
            />
          ) : (
            <>
              <AuthModeTabs
                isLogin={isLogin}
                onSelectLogin={() => switchMode(true)}
                onSelectRegister={() => switchMode(false)}
                loginLabel={t('auth.tabLogin')}
                registerLabel={t('auth.tabRegister')}
              />

              {isLogin ? (
                <AuthLoginFormSection
                  loginFlow={loginFlow}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  onForgotPassword={() => {
                    loginFlow.resetModalState();
                    forgotFlow.resetForm();
                    setShowForgotPassword(true);
                  }}
                />
              ) : (
                <AuthRegisterFormSection
                  registerFlow={registerFlow}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                />
              )}

              <AuthFormFooterLink
                isLogin={isLogin}
                onToggleMode={() => switchMode(!isLogin)}
                promptWhenLogin={t('auth.footerNoAccount')}
                promptWhenRegister={t('auth.footerHasAccount')}
                linkLabelWhenLogin={t('register')}
                linkLabelWhenRegister={t('login')}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={loginFlow.isModalOpen}
        onClose={loginFlow.closeModal}
        title={
          loginFlow.modalType === 'success' ? t('loginSuccessTitle') : t('loginErrorTitle')
        }
        type={loginFlow.modalType}
      >
        <p>{loginFlow.modalMessage}</p>
      </Modal>

      <Modal
        isOpen={registerFlow.isModalOpen}
        onClose={registerFlow.closeModal}
        title={t('registrationModalTitle')}
        type={registerFlow.modalType}
      >
        <p>{registerFlow.modalMessage}</p>
      </Modal>

      <Modal
        isOpen={forgotFlow.isModalOpen}
        onClose={forgotFlow.closeModal}
        title={
          forgotFlow.modalType === 'success'
            ? t('passwordResetSuccessTitle')
            : t('passwordResetErrorTitle')
        }
        type={forgotFlow.modalType}
      >
        <p>{forgotFlow.modalMessage}</p>
      </Modal>
    </div>
  );
}
