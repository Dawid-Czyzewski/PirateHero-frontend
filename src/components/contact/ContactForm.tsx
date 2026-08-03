import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { authInputPlainClassName } from '@/features/auth/authFormStyles';

export type ContactFormSubmitPayload = {
  success: boolean;
  message: string;
};

export type ContactFormProps = {
  onSubmit: (payload: ContactFormSubmitPayload) => void;
};

type ContactFormFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFieldErrors = Partial<Record<keyof ContactFormFields, string>>;

const emptyForm: ContactFormFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const fieldErrorRing = 'border-destructive ring-2 ring-destructive/25';

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormFields>(emptyForm);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): ContactFieldErrors => {
    const validationErrors: ContactFieldErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = t('contact.nameRequired');
    }

    if (!formData.email.trim()) {
      validationErrors.email = t('contact.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = t('contact.emailInvalid');
    }

    if (!formData.subject.trim()) {
      validationErrors.subject = t('contact.subjectRequired');
    }

    if (!formData.message.trim()) {
      validationErrors.message = t('contact.messageRequired');
    } else if (formData.message.trim().length < 10) {
      validationErrors.message = t('contact.messageMinLength');
    }

    return validationErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ContactFormFields;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      onSubmit({
        success: true,
        message: t('contact.successMessage'),
      });

      setFormData(emptyForm);
      setIsSubmitting(false);
    }, 500);
  };

  const fieldWrap = 'space-y-1.5';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      aria-label={t('contact.formAria')}
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
        <div className="flex flex-col gap-4">
          <div className={fieldWrap}>
            <label htmlFor="contact-name" className="text-sm text-muted-foreground">
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.namePlaceholder')}
              autoComplete="name"
              className={`${authInputPlainClassName} ${errors.name ? fieldErrorRing : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className={fieldWrap}>
            <label htmlFor="contact-email" className="text-sm text-muted-foreground">
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.emailPlaceholder')}
              autoComplete="email"
              inputMode="email"
              className={`${authInputPlainClassName} ${errors.email ? fieldErrorRing : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className={fieldWrap}>
            <label htmlFor="contact-subject" className="text-sm text-muted-foreground">
              {t('contact.subject')}
            </label>
            <input
              type="text"
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t('contact.subjectPlaceholder')}
              autoComplete="off"
              className={`${authInputPlainClassName} ${errors.subject ? fieldErrorRing : ''}`}
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div className={`flex min-h-0 flex-1 flex-col ${fieldWrap}`}>
            <label htmlFor="contact-message" className="text-sm text-muted-foreground">
              {t('contact.message')}
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder={t('contact.messagePlaceholder')}
              aria-describedby="contact-message-hint"
              className={`min-h-[140px] flex-1 resize-y md:min-h-[200px] ${authInputPlainClassName} ${errors.message ? fieldErrorRing : ''}`}
            />
            <p id="contact-message-hint" className="text-xs text-muted-foreground">
              {t('contact.messageHint')}
            </p>
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-sm font-bold text-primary-foreground transition-colors glow-gold hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                {t('contact.sending')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 shrink-0" aria-hidden />
                {t('contact.send')}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
