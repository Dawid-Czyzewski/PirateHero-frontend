import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Globe, Server } from 'lucide-react';
import pirateLogo from '@/assets/auth/pirate-logo.png';
import {
  HeaderMenuPicker,
  LANGUAGE_OPTIONS,
  SERVER_OPTIONS,
} from '@/components/HeaderMenuPicker';
import { getStoredGameServerId, setStoredGameServerId } from '@/features/game/settings/gameServers';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const guestChrome = !isAuthenticated;

  const [server, setServer] = useState(() => getStoredGameServerId());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState(
    () => localStorage.getItem('language') || i18n.language.split('-')[0] || 'en'
  );
  const [openPicker, setOpenPicker] = useState<'lang' | 'server' | null>(null);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLanguageChange = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleServerChange = (newServer: string) => {
    setServer(newServer);
    setStoredGameServerId(newServer);
  };

  const aboutNavGuest =
    'shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-primary no-underline';
  const aboutNavAuth =
    'shrink-0 cursor-pointer text-yellow-400 no-underline transition hover:text-amber-300';

  const langOptions = [...LANGUAGE_OPTIONS];
  const serverOptions = [...SERVER_OPTIONS];

  const pickerGroup = (compact?: boolean) => (
    <div
      className={
        compact
          ? 'flex flex-col gap-2'
          : 'flex shrink-0 flex-wrap items-center justify-end gap-2 md:gap-3'
      }
    >
      <HeaderMenuPicker
        guestChrome={guestChrome}
        variant="language"
        ariaLabel={t('language') || 'Language'}
        icon={Globe}
        value={language}
        options={langOptions}
        onSelect={handleLanguageChange}
        isOpen={openPicker === 'lang'}
        onOpenToggle={() => setOpenPicker((p) => (p === 'lang' ? null : 'lang'))}
        onClose={() => setOpenPicker(null)}
      />
      {!isAuthenticated && (
        <HeaderMenuPicker
          guestChrome={guestChrome}
          variant="server"
          ariaLabel={t('server') || 'Server'}
          icon={Server}
          value={server}
          options={serverOptions}
          onSelect={handleServerChange}
          isOpen={openPicker === 'server'}
          onOpenToggle={() => setOpenPicker((p) => (p === 'server' ? null : 'server'))}
          onClose={() => setOpenPicker(null)}
        />
      )}
    </div>
  );

  return (
    <header
      className={
        guestChrome
          ? 'shrink-0 bg-background text-foreground shadow-sm'
          : 'bg-black text-yellow-400 shadow-md'
      }
    >
      <a
        href="#main-content"
        className={
          guestChrome
            ? 'sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-bold focus:text-primary-foreground'
            : 'sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-yellow-400 focus:px-4 focus:py-2 focus:font-bold focus:text-black'
        }
      >
        {t('skipToContent')}
      </a>
      <div className="flex w-full items-center justify-between py-4 px-6 md:px-8">
        <div
          className={
            guestChrome
              ? 'flex min-w-0 items-center font-display text-xl font-bold tracking-wide md:text-2xl'
              : 'flex min-w-0 items-center text-2xl font-extrabold uppercase tracking-wide md:text-3xl'
          }
        >
          <Link
            to="/"
            className={
              guestChrome
                ? 'flex min-w-0 items-center gap-2 md:gap-2.5 text-gold-gradient'
                : 'flex min-w-0 items-center gap-2 md:gap-2.5 text-yellow-400 transition-colors hover:text-amber-300'
            }
            aria-label={t('gameTitle')}
          >
            <img
              src={pirateLogo}
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 object-contain drop-shadow-sm md:h-10 md:w-10"
            />
            <span className="truncate">{t('gameTitle')}</span>
          </Link>
        </div>

        <nav
          className="hidden items-center gap-6 text-base font-medium md:flex md:gap-8 md:text-lg"
          aria-label={t('mainNavigation')}
        >
          <Link to="/o-grze" className={guestChrome ? aboutNavGuest : aboutNavAuth}>
            {t('about')}
          </Link>
          <a
            href={isAuthenticated ? '/game' : '/auth'}
            className={
              guestChrome
                ? 'text-primary transition-colors hover:text-primary/85'
                : 'hover:text-amber-300 transition'
            }
          >
            {t('play')}
          </a>
          {pickerGroup(false)}
        </nav>

        <button
          type="button"
          className={
            guestChrome
              ? 'rounded-md border border-border p-2 text-foreground transition-colors hover:bg-muted md:hidden'
              : 'rounded-md border border-yellow-400/40 p-2 text-yellow-400 md:hidden'
          }
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="header-mobile-nav"
          aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
        >
          {isMenuOpen ? <X size={28} aria-hidden /> : <Menu size={28} aria-hidden />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="header-mobile-nav"
          className={
            guestChrome
              ? 'border-t border-primary/20 bg-background md:hidden'
              : 'border-t border-yellow-400 bg-black md:hidden'
          }
          role="navigation"
          aria-label={t('mainNavigation')}
        >
          <nav className="flex flex-col gap-4 py-4 px-6 text-lg font-medium md:px-8">
            <Link
              to="/o-grze"
              className={`${guestChrome ? aboutNavGuest : aboutNavAuth} text-left`}
            >
              {t('about')}
            </Link>
            <a
              href={isAuthenticated ? '/game' : '/auth'}
              className={
                guestChrome
                  ? 'text-primary transition-colors hover:text-primary/85'
                  : 'hover:text-amber-300 transition'
              }
            >
              {t('play')}
            </a>
            {pickerGroup(true)}
          </nav>
        </div>
      )}
    </header>
  );
}
