import { Anchor, Swords } from 'lucide-react';
import type { TFunction } from 'react-i18next';
import type { ArenaOpponent, FloatingDamage, FighterAnim } from './arenaTypes';
import { ARENA_BATTLE_BACKGROUND_SRC } from './arenaConstants';
import { ArenaBattleFighterAvatar } from './ArenaBattleFighterAvatar';
import { ArenaBattleShipSprite } from './ArenaBattleShipSprite';
import { ArenaDamageNumber } from './ArenaDamageNumber';

type Props = {
  t: TFunction;
  battlePhase: 'fighting' | 'result' | null;
  playerAnim: FighterAnim;
  oppAnim: FighterAnim;
  playerAvatarId: string;
  playerName?: string;
  opponent: ArenaOpponent;
  floatingDmg: FloatingDamage | null;
  battleVisual?: 'fighters' | 'ships';
  cannonMoveKey?: number;
  cannonSide?: 'left' | 'right' | null;
  backgroundSrc?: string;
};

export function ArenaBattleField({
  t,
  battlePhase,
  playerAnim,
  oppAnim,
  playerAvatarId,
  playerName = '',
  opponent,
  floatingDmg,
  battleVisual = 'fighters',
  cannonMoveKey = 0,
  cannonSide = null,
  backgroundSrc,
}: Props) {
  const battleBg = backgroundSrc?.trim() || ARENA_BATTLE_BACKGROUND_SRC;
  const leftLabel = playerName.trim() || String(t('arenaPage.you'));
  const showFleet = battleVisual === 'ships';

  const renderCombatants =
    battleVisual === 'ships' ? (
      <>
        <ArenaBattleShipSprite
          side="left"
          anim={playerAnim}
          label={leftLabel}
          showAttackFx={playerAnim === 'attack'}
          variant="friendly"
        />
        <ArenaBattleShipSprite
          side="right"
          anim={oppAnim}
          label={opponent.name}
          showAttackFx={oppAnim === 'attack'}
          variant="hostile"
        />
      </>
    ) : (
      <>
        <ArenaBattleFighterAvatar
          side="left"
          anim={playerAnim}
          avatarId={playerAvatarId}
          label={leftLabel}
          showAttackFx={playerAnim === 'attack'}
        />
        <ArenaBattleFighterAvatar
          side="right"
          anim={oppAnim}
          avatarId={opponent.avatarId}
          portraitSrc={opponent.portraitSrc}
          label={opponent.name}
          showAttackFx={oppAnim === 'attack'}
        />
      </>
    );

  return (
    <div className="relative flex h-[max(11rem,calc((100svh-14rem)/2))] w-full flex-col overflow-hidden rounded-lg border border-border/50">
      <div
        className={
          battleBg
            ? 'absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat'
            : 'absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black'
        }
        style={battleBg ? { backgroundImage: `url(${battleBg})` } : undefined}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background/90 via-background/20 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-3xl flex-1 items-end justify-between px-4 pb-3 sm:px-8 sm:pb-4">
        {renderCombatants}

        <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2 sm:bottom-12">
          {battlePhase === 'fighting' &&
            (showFleet ? (
              <Anchor className="h-9 w-9 animate-pulse text-cyan-200/85 drop-shadow-lg sm:h-11 sm:w-11" aria-hidden />
            ) : (
              <Swords className="h-10 w-10 animate-pulse text-primary drop-shadow-lg sm:h-12 sm:w-12" aria-hidden />
            ))}
        </div>

        {showFleet &&
          battlePhase === 'fighting' &&
          cannonSide &&
          cannonMoveKey > 0 && (
            <div
              className="pointer-events-none absolute inset-x-14 bottom-[22%] z-[15] h-10 sm:inset-x-20 sm:bottom-[26%]"
              aria-hidden
            >
              <div
                key={cannonMoveKey}
                className={`relative h-full w-full ${
                  cannonSide === 'left' ? 'animate-ship-cannon-ltr' : 'animate-ship-cannon-rtl'
                }`}
              >
                <span className="absolute left-1/2 top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_14px_theme(colors.amber.300)] ring-2 ring-amber-100/70" />
              </div>
            </div>
          )}

        {floatingDmg && (
          <ArenaDamageNumber
            key={floatingDmg.id}
            value={floatingDmg.value}
            critical={floatingDmg.critical}
            side={floatingDmg.side}
            dodge={floatingDmg.dodge}
            dodgeLabel={String(t('arenaPage.dodgeFloat'))}
          />
        )}
      </div>
    </div>
  );
}
