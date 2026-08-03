import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ShopView } from '@/features/game/store/shop/ShopView';
import { useShop } from '@/features/game/store/shop/useShop';
import type { StorePageProps } from '@/features/game/gamePageTypes';

export default function StorePage(_props: StorePageProps) {
  const { t } = useTranslation();
  const { user, fetchUserData } = useUser();

  usePageMeta({
    title: `${t('store')} | Pirate Hero`,
    description: t('storePage.seoDescription'),
    openGraph: true,
  });

  const shop = useShop({ user: user ?? undefined, fetchUserData });

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>{t('loading')}</p>
      </div>
    );
  }

  return <ShopView shop={shop} />;
}
