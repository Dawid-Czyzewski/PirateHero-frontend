import { useState } from 'react';
import { Anchor, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/modal/Modal';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  authInputClassName,
  authInputWithToggleClassName,
} from '@/features/auth/authFormStyles';
import {
  completePasswordReset,
  resolvePasswordResetError,
} from '@/services/passwordResetService';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; newPasswordRepeat?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  usePageMeta({
    title: t('passwordResetPage.seoTitle'),
    description: t('passwordResetPage.seoDescription'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = resetToken?.trim() ?? '';
    const nextErrors: { newPassword?: string; newPasswordRepeat?: string } = {};
    if (!newPassword) {
      nextErrors.newPassword = t('passwordRequired');
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = t('passwordResetNewTooShort');
    }
    if (!newPasswordRepeat) {
      nextErrors.newPasswordRepeat = t('repeatPasswordRequired');
    } else if (newPassword !== newPasswordRepeat) {
      nextErrors.newPasswordRepeat = t('passwordResetNewMismatch');
    }
    if (!token) {
      setModalType('error');
      setModalMessage(t('passwordResetTokenInvalid'));
      setIsModalOpen(true);
      return;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await completePasswordReset({
        token,
        newPassword,
        newPasswordRepeat,
      });
      setModalType('success');
      setModalMessage(t('passwordResetCompleted'));
      setIsModalOpen(true);
    } catch (err) {
      setModalType('error');
      setModalMessage(resolvePasswordResetError(err, t, 'passwordResetFailed'));
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalType === 'success') {
      navigate('/auth', { replace: true });
    }
  };

  return (
    <div className="flex flex-1 min-h-0 w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card/95 p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t('passwordResetPage.title')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('passwordResetPage.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="reset-password" className="text-sm text-muted-foreground">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                className={authInputWithToggleClassName}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-password-repeat" className="text-sm text-muted-foreground">
              {t('repeatPassword')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                id="reset-password-repeat"
                type={showPassword ? 'text' : 'password'}
                name="newPasswordRepeat"
                autoComplete="new-password"
                value={newPasswordRepeat}
                onChange={(e) => {
                  setNewPasswordRepeat(e.target.value);
                  setErrors((prev) => ({ ...prev, newPasswordRepeat: undefined }));
                }}
                className={authInputWithToggleClassName}
              />
            </div>
            {errors.newPasswordRepeat ? (
              <p className="text-sm text-destructive">{errors.newPasswordRepeat}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {t('passwordResetSaving')}
              </>
            ) : (
              <>
                <Anchor className="h-4 w-4 shrink-0" />
                {t('passwordResetSavePassword')}
              </>
            )}
          </button>
        </form>

        <Link
          to="/auth"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('passwordResetBackToLogin')}
        </Link>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalType === 'success' ? t('passwordResetSuccessTitle') : t('passwordResetErrorTitle')}
        type={modalType}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}
