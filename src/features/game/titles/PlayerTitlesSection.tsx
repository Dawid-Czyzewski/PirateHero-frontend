import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import { equipPlayerTitle, fetchPlayerTitles } from '@/services/playerTitleService';
import type { PlayerTitleDto } from '@/types/playerTitle';
import { TitleCard } from '@/features/game/titles/TitleCard';

export function PlayerTitlesSection() {
  const { t } = useTranslation();
  const { fetchUserData } = useUser();
  const [titles, setTitles] = useState<PlayerTitleDto[]>([]);
  const [equippedTitleCode, setEquippedTitleCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [equippingCode, setEquippingCode] = useState<string | null>(null);

  const loadTitles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPlayerTitles();
      setTitles(data.titles ?? []);
      setEquippedTitleCode(data.equippedTitleCode ?? null);
    } catch {
      setTitles([]);
      setEquippedTitleCode(null);
      toast.error(t('titlesPage.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadTitles();
  }, [loadTitles]);

  const handleEquip = async (code: string) => {
    setEquippingCode(code);
    try {
      const result = await equipPlayerTitle(code);
      setEquippedTitleCode(result.equippedTitleCode);
      await fetchUserData();
      toast.success(t('titlesPage.equipSuccess'));
    } catch (error) {
      const key = error instanceof ApiHttpError ? error.message : 'titlesPage.equipError';
      toast.error(t(key, { defaultValue: t('titlesPage.equipError') }));
    } finally {
      setEquippingCode(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t('titlesPage.loading')}</p>;
  }

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {titles.map((title) => (
        <TitleCard
          key={title.code}
          title={title}
          isEquipped={equippedTitleCode === title.code}
          isEquipping={equippingCode === title.code}
          onEquip={handleEquip}
        />
      ))}
    </div>
  );
}
