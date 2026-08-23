import { useEffect, useState } from 'react';
import { Coins, Gem, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GameItem } from '@/features/game/character/characterTypes';
import type { SlotType } from '@/data/gameItems';
import rpgCharacter from '@/assets/rpg-character.jpg';
import { AUTH_AVATARS, resolveAvatarLabel } from '@/features/auth/authAvatars';
import { ExperienceBar } from '@/components/ui/ExperienceBar';
import { gamePagePlayerTypedHeroClass } from '@/features/game/layout/gamePageTitleClasses';
import { PlayerTitleBadge } from '@/features/game/player/PlayerTitleBadge';
import type { EquippedTitleDto } from '@/types/playerTitle';
import { CharacterEquipSlot } from './CharacterEquipSlot';

type Props = {
  username?: string;
  avatarName?: string;
  equippedTitle?: EquippedTitleDto | null;
  levelName?: string;
  experiencePoints?: number;
  expToNextLevel?: number;
  gold?: number;
  famePoints?: number;
  diamonds?: number;
  equipped: Partial<Record<SlotType, string>>;
  catalog: Map<string, GameItem>;
  activeChestDragSlot?: SlotType | null;
  onDrop: (itemId: string, slot: SlotType) => void | Promise<void>;
  onUnequip: (slot: SlotType) => void | Promise<void>;
  upgradingId?: string | null;
  onUpgrade?: (itemId: string) => void | Promise<void>;
  readOnly?: boolean;
  heroStatsMode?: 'default' | 'fameOnly';
};

const LEFT_SLOTS: SlotType[] = ['helmet', 'weapon', 'armor'];
const RIGHT_SLOTS: SlotType[] = ['amulet', 'ring', 'boots'];
const MOBILE_SLOT_ORDER: SlotType[] = [
  'helmet',
  'amulet',
  'weapon',
  'ring',
  'armor',
  'boots',
];

export function CharacterPaperDoll({
  username,
  avatarName,
  equippedTitle,
  levelName,
  experiencePoints = 0,
  expToNextLevel = 100,
  gold = 0,
  famePoints = 0,
  diamonds = 0,
  equipped,
  catalog,
  activeChestDragSlot = null,
  onDrop,
  onUnequip,
  upgradingId = null,
  onUpgrade,
  readOnly = false,
  heroStatsMode = 'default',
}: Props) {
  const { t } = useTranslation();
  const [isSmUp, setIsSmUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
  );
  const fameOnlyHero = heroStatsMode === 'fameOnly';
  const avatarId = (avatarName ?? '').trim().toLowerCase();
  const avatarMatch = AUTH_AVATARS.find(
    (avatar) => avatar.id.toLowerCase() === avatarId || avatar.fileKey.toLowerCase() === avatarId
  );
  const avatarSrc = avatarMatch?.imageSrc ?? rpgCharacter;
  const avatarLabel = resolveAvatarLabel(t, avatarName || t('characterPage.className'));

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => setIsSmUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const renderSlot = (
    slot: SlotType,
    tooltipSide: 'left' | 'right' | 'bottom' | 'top',
    layout: 'row' | 'tile' = 'row'
  ) => (
    <CharacterEquipSlot
      key={slot}
      slotType={slot}
      item={equipped[slot] ? catalog.get(equipped[slot]!) ?? null : null}
      activeChestDragSlot={activeChestDragSlot}
      onDrop={onDrop}
      onUnequip={onUnequip}
      tooltipSide={tooltipSide}
      gold={gold}
      upgrading={
        equipped[slot] ? upgradingId === equipped[slot] : false
      }
      onUpgrade={onUpgrade}
      readOnly={readOnly}
      layout={layout}
    />
  );

  const heroBlock = (
    <div className="flex flex-col items-center gap-3 pt-1 lg:gap-4">
      <div className="relative self-center">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-xl" />
        <img
          src={avatarSrc}
          alt={t('characterPage.heroImageAlt')}
          className="relative h-36 w-36 rounded-2xl border-2 border-primary/40 object-cover shadow-[0_0_30px_hsl(42,90%,50%,0.12)] sm:h-40 sm:w-40 md:h-44 md:w-44 lg:h-56 lg:w-56"
          width={224}
          height={224}
        />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 shadow-lg">
          <span className="font-heading text-xs font-black text-primary-foreground">
            LVL {levelName || '1'}
          </span>
        </div>
      </div>

      <div className="mt-2 w-full min-w-0 text-center">
        <PlayerTitleBadge title={equippedTitle} className="mb-1 block" />
        <h1 className={gamePagePlayerTypedHeroClass}>
          {username || t('characterPage.heroTitle')}
        </h1>
        <p className="mt-1 text-base font-heading font-bold text-primary">{avatarLabel}</p>
      </div>

      {!fameOnlyHero ? (
        <div className="w-full max-w-[290px]">
          <ExperienceBar
            current={experiencePoints}
            max={expToNextLevel}
            label={t('exp')}
            className="w-full"
            heightClassName="h-5"
          />
        </div>
      ) : null}

      <div className="mt-1 flex w-full min-w-0 items-start justify-center gap-5">
        {!fameOnlyHero ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-heading text-sm font-bold text-primary">{gold}</span>
            </div>
            <span className="text-[10px] text-primary/80">{t('characterPage.goldLabel')}</span>
          </div>
        ) : null}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1.5">
            <Star className="h-5 w-5 text-purple-400" />
            <span className="font-heading text-sm font-bold text-purple-300">{famePoints}</span>
          </div>
          <span className="text-[10px] text-purple-300/80">{t('characterPage.fameLabel')}</span>
        </div>
        {!fameOnlyHero ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5">
              <Gem className="h-5 w-5 text-blue-400" />
              <span className="font-heading text-sm font-bold text-blue-300">{diamonds}</span>
            </div>
            <span className="text-[10px] text-blue-300/80">{t('characterPage.diamondsLabel')}</span>
          </div>
        ) : null}
      </div>

      {!readOnly ? (
        <p className="mt-1 hidden text-[10px] text-muted-foreground/60 sm:block">
          {t('characterPage.dragHint')}
        </p>
      ) : null}
    </div>
  );

  if (!isSmUp) {
    return (
      <div className="flex flex-col gap-4">
        {heroBlock}
        <div className="grid grid-cols-3 gap-2">
          {MOBILE_SLOT_ORDER.map((slot) => renderSlot(slot, 'top', 'tile'))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-3 sm:grid-cols-[1fr_auto_1fr] md:gap-4 lg:gap-6">
      <div className="flex flex-col gap-2 pt-4">
        {LEFT_SLOTS.map((slot) => renderSlot(slot, 'left'))}
      </div>
      {heroBlock}
      <div className="flex flex-col gap-2 pt-4">
        {RIGHT_SLOTS.map((slot) => renderSlot(slot, 'right'))}
      </div>
    </div>
  );
}
