import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { ApiHttpError } from '@/lib/api/ApiHttpError';
import {
  equipPlayerTitle,
  fetchPlayerTitles,
  unequipPlayerTitle,
} from '@/services/playerTitleService';
import type { EquippedTitleDto, PlayerTitleDto } from '@/types/playerTitle';
import { TitleCard } from '@/features/game/titles/TitleCard';

export function PlayerTitlesSection() {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const [titles, setTitles] = useState<PlayerTitleDto[]>([]);
  const [equippedTitleCode, setEquippedTitleCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const actionIdRef = useRef(0);

  const titleDto = useCallback(
    (code: string | null): EquippedTitleDto | null => {
      if (!code) return null;
      const title = titles.find((row) => row.code === code);
      return title ? { code: title.code, nameKey: title.nameKey } : null;
    },
    [titles]
  );

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

  const handleEquip = (code: string) => {
    const actionId = ++actionIdRef.current;
    const previous = equippedTitleCode;
    setEquippedTitleCode(code);
    void updateUser({ equippedTitle: titleDto(code) });

    void equipPlayerTitle(code).catch((error) => {
      if (actionId !== actionIdRef.current) return;
      setEquippedTitleCode(previous);
      void updateUser({ equippedTitle: titleDto(previous) });
      const key = error instanceof ApiHttpError ? error.message : 'titlesPage.equipError';
      toast.error(t(key, { defaultValue: t('titlesPage.equipError') }));
    });
  };

  const handleUnequip = () => {
    const actionId = ++actionIdRef.current;
    const previous = equippedTitleCode;
    setEquippedTitleCode(null);
    void updateUser({ equippedTitle: null });

    void unequipPlayerTitle().catch(() => {
      if (actionId !== actionIdRef.current) return;
      setEquippedTitleCode(previous);
      void updateUser({ equippedTitle: titleDto(previous) });
      toast.error(t('titlesPage.unequipError'));
    });
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t('titlesPage.loading')}</p>;
  }

  if (titles.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('titlesPage.empty')}</p>;
  }

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {titles.map((title) => (
        <TitleCard
          key={title.code}
          title={title}
          isEquipped={equippedTitleCode === title.code}
          onEquip={handleEquip}
          onUnequip={handleUnequip}
        />
      ))}
    </div>
  );
}
