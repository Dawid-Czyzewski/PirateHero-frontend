import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  validateRegisterForm,
  type RegisterFormErrors,
} from '@/services/validationService';
import { extractProblemMessage } from '@/lib/apiError';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { AUTH_AVATARS } from '@/features/auth/authAvatars';

export type RegisterModalType = 'success' | 'error';
export type RegisterStep = 1 | 2;

export function useRegisterFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    rulesAccepted: false,
    avatarName: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<RegisterModalType>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetModalState = () => {
    setIsModalOpen(false);
    setRegisterStep(1);
  };

  const validateStepOne = () => {
    const validationErrors = validateRegisterForm(formData, t);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const goToAvatarStep = () => {
    if (validateStepOne()) {
      setRegisterStep(2);
    }
  };

  const backToCredentialsStep = () => setRegisterStep(1);

  const selectAvatar = (avatarName: string) => {
    setFormData((prev) => ({ ...prev, avatarName }));
    setErrors((prev) => ({ ...prev, avatarName: undefined }));
  };

  const submitRegistration = async (avatarOverride?: string) => {
    const avatarName = avatarOverride ?? formData.avatarName;
    if (!avatarName) {
      setErrors((prev) => ({ ...prev, avatarName: t('avatarRequired') }));
      return;
    }

    setIsSubmitting(true);
    try {
      await publicRequestUnknown('/register', {
        method: 'POST',
        body: {
          ...formData,
          avatarName,
        },
      });
      setIsModalOpen(false);
      navigate(`/auth/registration-success?email=${encodeURIComponent(formData.email)}`);
      return;
    } catch (err) {
      if (err instanceof ApiHttpError) {
        if (err.status === 0) {
          setModalMessage(t('networkUnavailable'));
        } else {
          const detail = extractProblemMessage(err.body, '');
          if (detail === 'emailIsAlreadyTaken') {
            setModalMessage(t('emailIsAlreadyTaken'));
          } else if (detail === 'usernameIsAlreadyTaken') {
            setModalMessage(t('usernameIsAlreadyTaken'));
          } else {
            setModalMessage(t('registrationFailed'));
          }
        }
        setModalType('error');
      } else {
        setModalMessage(t('registrationError'));
        setModalType('error');
      }
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stepOneOk = validateStepOne();
    if (!stepOneOk) return;
    await submitRegistration(formData.avatarName || AUTH_AVATARS[0]?.id || '');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return {
    t,
    formData,
    errors,
    registerStep,
    avatars: AUTH_AVATARS,
    isSubmitting,
    isModalOpen,
    modalMessage,
    modalType,
    handleChange,
    goToAvatarStep,
    backToCredentialsStep,
    selectAvatar,
    submitRegistration,
    handleSubmit,
    closeModal,
    resetModalState,
  };
}
