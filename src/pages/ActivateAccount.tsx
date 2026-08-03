import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MailWarning, Loader2, ArrowLeft, Anchor } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { publicRequestUnknown } from '@/lib/api/publicRequestUnknown';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { usePageMeta } from '@/hooks/usePageMeta';
import heroImage from '@/assets/auth/hero-pirate.jpg';

type ActivationState = {
  status: 'loading' | 'success' | 'error';
  message: string;
};

type ActivationResult = {
  status: 'success' | 'error';
  message: string;
};

const activationRequestCache = new Map<string, Promise<ActivationResult>>();

export default function ActivateAccount() {
  const { t } = useTranslation();
  const { activateToken } = useParams();

  const [state, setState] = useState<ActivationState>({
    status: 'loading',
    message: '',
  });

  const seoTitle = useMemo(() => {
    if (state.status === 'success') return t('activationPage.seoTitleSuccess');
    if (state.status === 'error') return t('activationPage.seoTitleError');
    return t('activationPage.seoTitleLoading');
  }, [state.status, t]);

  usePageMeta({
    title: seoTitle,
    description: t('activationPage.seoDescription'),
  });

  useEffect(() => {
    let isMounted = true;

    const activateAccount = async () => {
      if (!activateToken?.trim()) {
        if (!isMounted) return;
        setState({ status: 'error', message: t('activationFailed') });
        return;
      }

      const tokenKey = activateToken.trim();
      let request = activationRequestCache.get(tokenKey);
      if (!request) {
        request = publicRequestUnknown(`/activate-account/${encodeURIComponent(tokenKey)}`, {
          method: 'GET',
        })
          .then(
            (): ActivationResult => ({
              status: 'success',
              message: t('accountActivated'),
            })
          )
          .catch((err: unknown): ActivationResult => {
            const message =
              err instanceof ApiHttpError && err.status === 0
                ? t('networkUnavailable')
                : err instanceof ApiHttpError
                  ? t('activationFailed')
                  : t('activationError');
            return { status: 'error', message };
          });
        activationRequestCache.set(tokenKey, request);
      }

      const result = await request;
      if (!isMounted) return;
      if (result.status === 'success') {
        setState({ status: 'success', message: result.message });
      } else {
        if (!isMounted) return;
        setState({ status: 'error', message: result.message });
      }
    };

    void activateAccount();
    return () => {
      isMounted = false;
    };
  }, [activateToken, t]);

  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';

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
        <div className="rounded-xl border border-border bg-card/95 p-6 text-center shadow-xl sm:p-8">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 ${
              isLoading
                ? 'border-primary/30 bg-primary/10'
                : isSuccess
                  ? 'border-emerald-400/35 bg-emerald-500/10 shadow-[0_0_0_6px_rgba(34,197,94,0.12)]'
                  : 'border-destructive/30 bg-destructive/10'
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            ) : (
              <MailWarning className="h-10 w-10 text-destructive" />
            )}
          </div>

          <h1
            className={`mb-3 font-display text-2xl font-black tracking-wider ${
              isSuccess ? 'text-[#f2e6cf] uppercase' : 'text-foreground'
            }`}
          >
            {isLoading
              ? t('activationPage.titleLoading')
              : isSuccess
                ? t('activationPage.titleSuccess')
                : t('activationPage.titleError')}
          </h1>

          <p className={`mb-8 text-sm ${isSuccess ? 'text-[#b8b8c6]' : 'text-muted-foreground'}`}>
            {isLoading ? t('activationPage.loadingText') : state.message}
          </p>

          {!isLoading && (
            <Link
              to={isSuccess ? '/auth' : '/'}
              className={
                isSuccess
                  ? 'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-display text-sm tracking-wide text-primary-foreground uppercase transition glow-gold hover:bg-primary/90'
                  : 'inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {isSuccess ? <Anchor className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              {isSuccess ? t('activationPage.backToLogin') : t('activationPage.backToHome')}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
