import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  requestPasswordReset,
  resolvePasswordResetError,
} from '@/services/passwordResetService';

export function useForgotPasswordFlow() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const nextErrors: { email?: string } = {};
      if (!email.trim()) {
        nextErrors.email = t('emailRequired');
      }
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        await requestPasswordReset(email.trim());
        setModalType('success');
        setModalMessage(t('passwordResetRequestSent'));
        setIsModalOpen(true);
      } catch (err) {
        setModalType('error');
        setModalMessage(
          resolvePasswordResetError(err, t, 'passwordResetRequestFailed')
        );
        setIsModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, t]
  );

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    email,
    errors,
    isSubmitting,
    isModalOpen,
    modalType,
    modalMessage,
    handleChange,
    handleSubmit,
    closeModal,
    resetForm: () => {
      setEmail('');
      setErrors({});
    },
  };
}
