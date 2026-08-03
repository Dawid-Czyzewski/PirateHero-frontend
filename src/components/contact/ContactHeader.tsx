import { useTranslation } from 'react-i18next';

export default function ContactHeader() {
  const { t } = useTranslation();

  return (
    <header className="mb-6 text-center md:mb-8">
      <h1
        id="contact-page-heading"
        className="font-display text-3xl font-bold text-gold-gradient sm:text-4xl"
      >
        {t('contact.title')}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t('contact.description')}
      </p>
    </header>
  );
}
