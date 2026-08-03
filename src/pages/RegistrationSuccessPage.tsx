import { ArrowLeft, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '@/hooks/usePageMeta';
import heroImage from '@/assets/auth/hero-pirate.jpg';

export default function RegistrationSuccessPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';

  usePageMeta({
    title: t('registerSuccess.seoTitle'),
    description: t('registerSuccess.seoDescription'),
  });

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 sm:py-12">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-lg border border-border bg-card p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>

          <h1 className="mb-3 font-display text-2xl font-black tracking-wider text-foreground">
            {t('registerSuccess.title')}
          </h1>

          <p className="mb-2 text-muted-foreground">
            {t('registerSuccess.primaryText')}{' '}
            <span className="font-semibold text-primary">{t('registerSuccess.activationLink')}</span>.
          </p>

          {email ? (
            <p className="mb-2 text-sm text-muted-foreground">
              {t('registerSuccess.sentTo')}{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </p>
          ) : null}

          <p className="mb-8 text-sm text-muted-foreground">{t('registerSuccess.secondaryText')}</p>

          <div className="mb-6 rounded-md border border-border bg-[hsla(220,15%,20%,0.5)] p-4">
            <p className="text-xs text-muted-foreground">
              {t('registerSuccess.spamHint')}{' '}
              <span className="font-semibold text-foreground">{t('registerSuccess.spamFolder')}</span>.
            </p>
          </div>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('registerSuccess.backToLogin')}
          </Link>
        </div>
      </div>
    </section>
  );
}
