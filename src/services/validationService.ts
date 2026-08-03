import type { TFunction } from 'i18next';

export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
  rulesAccepted: boolean;
  avatarName?: string;
};

export type RegisterFormErrors = Partial<
  Record<
    'username' | 'email' | 'password' | 'passwordRepeat' | 'rulesAccepted' | 'avatarName',
    string
  >
>;

export const validateRegisterForm = (
  formData: RegisterFormData,
  t: TFunction
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (!formData.username) {
    errors.username = t('usernameRequired');
  } else if (formData.username.length < 3 || formData.username.length > 30) {
    errors.username = t('usernameLength', { min: 3, max: 30 });
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
    errors.username = t('usernameInvalid');
  }

  if (!formData.email) {
    errors.email = t('emailRequired');
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = t('emailInvalid');
  }

  if (!formData.password) {
    errors.password = t('passwordRequired');
  } else if (formData.password.length < 6) {
    errors.password = t('passwordLength', { min: 6 });
  }

  if (!formData.passwordRepeat) {
    errors.passwordRepeat = t('passwordRepeatRequired');
  } else if (formData.password !== formData.passwordRepeat) {
    errors.passwordRepeat = t('passwordsMustMatch');
  }

  if (!formData.rulesAccepted) {
    errors.rulesAccepted = t('rulesAcceptedRequired');
  }

  return errors;
};
