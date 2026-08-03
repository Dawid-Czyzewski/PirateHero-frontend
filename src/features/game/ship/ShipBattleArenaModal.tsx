import type { TFunction } from 'i18next';
import ShipFightArena from '@/features/game/ship/ShipFightArena';
import type { ShipFightStartData } from '@/types/shipFight';

type Props = {
  open: boolean;
  data: ShipFightStartData | null;
  isReplay?: boolean;
  viewerShipId: string;
  playerUsername?: string;
  playerLevel?: number;
  playerAvatarId?: string;
  t?: TFunction;
  onRequestClose: () => void;
};

export function ShipBattleArenaModal({
  open,
  data,
  isReplay = false,
  viewerShipId,
  onRequestClose,
}: Props) {
  if (!open || !data) {
    return null;
  }

  return (
    <ShipFightArena
      isOpen={open}
      fightResult={data}
      viewerShipId={viewerShipId}
      isReplay={isReplay}
      onClose={onRequestClose}
      onFightComplete={() => undefined}
    />
  );
}
