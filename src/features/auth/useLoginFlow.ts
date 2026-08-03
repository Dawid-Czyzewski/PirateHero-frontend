import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { getPrimaryApiErrorMessage, isAccountNotActivatedError } from '@/lib/apiError';
import { isApiSuccessEnvelope, unwrapApiSuccessData } from '@/lib/api/envelope';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import type { LegacyLoginResponseBody, LoginSuccessPayload } from '@/types/auth';

export function useLoginFlow() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('error');

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  
  const resetModalState = useCallback(() => setIsModalOpen(false), []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors: Record<string, string> = {};
    if (!formData.email) validationErrors.email = t('emailRequired');
    if (!formData.password) validationErrors.password = t('passwordRequired');
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const rawBody = await publicRequestUnknown('/login', {
          method: 'POST',
          body: formData,
        });
        let token = '';
        let refreshToken = '';
        let userId = '';

        if (isApiSuccessEnvelope(rawBody)) {
          const data = unwrapApiSuccessData<LoginSuccessPayload>(rawBody);
          token = data.token;
          refreshToken = data.refresh_token;
          userId =
            data.user?.id != null && data.user.id !== ''
              ? String(data.user.id)
              : '';
        } else {
          const legacy = rawBody as LegacyLoginResponseBody;
          token =
            typeof legacy.token === 'string'
              ? legacy.token
              : typeof legacy.access_token === 'string'
                ? legacy.access_token
                : '';
          refreshToken =
            typeof legacy.refresh_token === 'string'
              ? legacy.refresh_token
              : typeof legacy.refreshToken === 'string'
                ? legacy.refreshToken
                : '';
          const userObj = legacy.user;
          const rawId = userObj?.id ?? legacy.id;
          userId = rawId != null && rawId !== '' ? String(rawId) : '';
        }

        if (!token || !refreshToken || !userId) {
          setModalMessage(t('loginFailed'));
          setModalType('error');
          setIsModalOpen(true);
        } else {
          login(token, refreshToken, userId);
          setModalMessage(t('loginSuccess'));
          setModalType('success');
          setIsModalOpen(true);
        }
      } catch (err) {
        if (err instanceof ApiHttpError) {
          const primary = getPrimaryApiErrorMessage(err.body);
          if (err.status === 0) {
            setModalMessage(t('networkUnavailable'));
          } else if (err.status === 401) {
            setModalMessage(t('invalidCredentials'));
          } else if (
            err.status === 403 &&
            isAccountNotActivatedError(primary, err.body)
          ) {
            setModalMessage(t('accountNotActivated'));
          } else if (primary !== '') {
            setModalMessage(primary);
          } else {
            setModalMessage(t('loginFailed'));
          }
        } else {
          setModalMessage(t('loginError'));
        }
        setModalType('error');
        setIsModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    t,
    formData,
    errors,
    isSubmitting,
    isModalOpen,
    modalMessage,
    modalType,
    handleSubmit,
    handleChange,
    closeModal,
    resetModalState,
  };
}
