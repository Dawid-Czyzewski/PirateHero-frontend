import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APP_VERSION } from '@/config/appVersion';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const guestChrome = !isAuthenticated;
  const year = new Date().getFullYear();

  const linkClass = guestChrome
    ? 'text-sm font-medium text-primary hover:text-primary/85 hover:underline underline-offset-2 transition-colors cursor-pointer md:text-base'
    : 'text-sm font-medium text-yellow-400 hover:text-amber-300 hover:underline underline-offset-2 transition-colors cursor-pointer md:text-base';

  const footerShell = guestChrome
    ? 'mt-auto w-full shrink-0 border-t border-primary/20 bg-background text-muted-foreground shadow-sm'
    : 'mt-auto w-full shrink-0 border-t border-yellow-400/40 bg-black text-yellow-400/80 shadow-md';

  const metaClass = guestChrome
    ? 'order-2 text-base text-muted-foreground md:order-1'
    : 'order-2 text-base text-yellow-400/70 md:order-1';

  return (
    <footer className={footerShell}>
      <div className="flex w-full flex-col items-center gap-6 py-4 px-6 text-center md:flex-row md:items-center md:justify-between md:gap-0 md:px-8 md:text-left">
        <div className={`flex flex-col items-center gap-1 md:items-start ${metaClass}`}>
          <p>
            &copy; {year} {t('footer.copyright')}
          </p>
          <p className="text-sm opacity-80">{t('footer.version', { version: APP_VERSION })}</p>
        </div>

        <nav className="order-1 flex flex-col items-center justify-center gap-4 md:order-2 md:flex-row md:gap-8">
          <Link to="/contact" className={linkClass}>
            {t('footer.contact')}
          </Link>
          <a href="/terms" className={linkClass}>
            {t('footer.terms')}
          </a>
          <a href="/privacy" className={linkClass}>
            {t('footer.privacy')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
