import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';

export default function ContactInfo() {
  const { t } = useTranslation();

  return (
    <aside
      className="mt-6 border-t border-primary/20 pt-6 md:mt-8"
      aria-labelledby="contact-direct-heading"
    >
      <h2
        id="contact-direct-heading"
        className="mb-3 text-center font-display text-base font-semibold text-foreground md:sr-only"
      >
        {t('contact.otherWays')}
      </h2>
      <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span className="font-medium text-foreground">{t('contact.emailLabel')}:</span>
          <a
            href="mailto:support@piratehero.com"
            className="font-medium text-primary underline-offset-2 transition-colors hover:text-primary/85 hover:underline"
          >
            support@piratehero.com
          </a>
        </div>
        <p className="text-center text-xs md:max-w-xs md:text-right md:text-sm">{t('contact.responseTime')}</p>
      </div>
    </aside>
  );
}
