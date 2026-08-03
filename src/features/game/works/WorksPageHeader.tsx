import { gamePageTitleH1Class } from '@/features/game/layout/gamePageTitleClasses';

type Props = {
  t: (key: string) => string;
};

export function WorksPageHeader({ t }: Props) {
  return (
    <header className="flex w-full flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <h1 className={gamePageTitleH1Class}>
        {t('works')}
      </h1>
    </header>
  );
}
