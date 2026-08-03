import { useCallback, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { toast } from 'sonner';
import { Lock, Server } from 'lucide-react';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { usePageMeta } from '@/hooks/usePageMeta';
import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';
import {
  DEFAULT_GAME_SERVER_ID,
  getStoredGameServerId,
  subscribeStoredGameServerId,
} from '@/features/game/settings/gameServers';
import { changePassword } from '@/services/changePasswordService';

function translateApiDetail(t: TFunction, detail: string): string {
  const msg = t(detail);
  return msg !== detail ? msg : t('settingsPage.password.changeFailed');
}

export default function SettingsPage() {
  const { t } = useTranslation();

  usePageMeta({
    title: t('settingsPage.seoTitle'),
    description: t('settingsPage.seoDescription'),
    openGraph: true,
  });

  const storedServerId = useSyncExternalStore(
    subscribeStoredGameServerId,
    getStoredGameServerId,
    () => ''
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const serverIdLabel = storedServerId !== '' ? storedServerId : DEFAULT_GAME_SERVER_ID;

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error(t('settingsPage.password.fillAll'));
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error(t('settingsPage.password.mismatch'));
        return;
      }
      if (newPassword.length < 6) {
        toast.error(t('settingsPage.password.tooShort'));
        return;
      }

      setSavingPassword(true);
      try {
        await changePassword({
          currentPassword,
          newPassword,
          newPasswordRepeat: confirmPassword,
        });
        toast.success(t('settingsPage.password.changedSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        if (err instanceof ApiHttpError) {
          toast.error(translateApiDetail(t, err.message));
        } else {
          toast.error(t('settingsPage.password.changeFailed'));
        }
      } finally {
        setSavingPassword(false);
      }
    },
    [confirmPassword, currentPassword, newPassword, t]
  );

  return (
    <section className="w-full space-y-6" aria-label={t('settingsPage.pageAriaLabel')}>
      <h1 className={gamePageTitleH1Class}>{t('settingsPage.title')}</h1>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-lg border border-border/40 bg-card/25 p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary">
            <Lock className="h-5 w-5" aria-hidden />
            {t('settingsPage.password.title')}
          </h2>
          <form onSubmit={handleChangePassword} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="settings-current-password" className="text-sm font-semibold">
                {t('settingsPage.password.current')}
              </label>
              <input
                id="settings-current-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={savingPassword}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-new-password" className="text-sm font-semibold">
                {t('settingsPage.password.new')}
              </label>
              <input
                id="settings-new-password"
                type="password"
                autoComplete="new-password"
                placeholder={t('settingsPage.password.newPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={savingPassword}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="settings-confirm-password" className="text-sm font-semibold">
                {t('settingsPage.password.confirm')}
              </label>
              <input
                id="settings-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder={t('settingsPage.password.confirmPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={savingPassword}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-primary bg-primary px-4 py-2.5 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock className="h-4 w-4" aria-hidden />
              {savingPassword ? t('settingsPage.password.submitting') : t('settingsPage.password.submit')}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-border/40 bg-card/25 p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary">
            <Server className="h-5 w-5" aria-hidden />
            {t('settingsPage.server.title')}
          </h2>
          <p className="text-sm font-medium text-foreground">{serverIdLabel}</p>
        </div>
      </div>
    </section>
  );
}
