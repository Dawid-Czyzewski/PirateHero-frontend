"use client";

import { useEffect } from "react";
import { PoolPanel } from "@/components/character/PoolPanel";
import { FightArena } from "@/components/combat/fight/FightArena";
import { FightPending } from "@/components/combat/fight/FightPending";
import { NpcRoster } from "@/components/combat/NpcRoster";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { ScreenAlert } from "@/components/game/ScreenAlert";
import { ScreenMain } from "@/components/game/ScreenMain";
import { ScreenTitle } from "@/components/game/ScreenTitle";
import { FIGHT_POINTS_LABEL, type CharacterSheet } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { usePoolCountdown } from "@/modules/character/hooks/usePoolCountdown";
import { OCTAGON_HEADER } from "@/modules/character/layerAssets";
import { FIGHT_POINT_SECONDS_PER_POINT, waitHint, type RegenPool } from "@/modules/character/regenPool";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";
import { FIGHT_POINT_COST } from "@/modules/combat/fight";
import { useFight, type FightSession } from "@/modules/combat/hooks/useFight";
import { useNpcs, type NpcsSession, type NpcsState } from "@/modules/combat/hooks/useNpcs";

type OctagonContentProps = {
  character: CharacterSheet;
  fightPoints: RegenPool;
  npcs: NpcsSession;
  fight: FightSession;
  onSettled: () => void;
};

function nickOf(state: NpcsState, npcId: string): string | null {
  return state.kind === "loaded" ? (state.npcs.find(({ id }) => id === npcId)?.nick ?? null) : null;
}

function fightBlockedHint(fightPoints: RegenPool): string | null {
  if (fightPoints.current >= FIGHT_POINT_COST) return null;
  return waitHint(fightPoints, FIGHT_POINT_COST, FIGHT_POINT_SECONDS_PER_POINT, "Następna walka za") ?? "Brak punktów walki";
}

function OctagonContent({ character, fightPoints, npcs, fight, onSettled }: OctagonContentProps) {
  const { state } = fight;

  if (state.kind === "done") {
    return (
      <FightArena
        fight={state.fight}
        playerLook={character.appearance}
        onSettled={onSettled}
        onRematch={() => fight.start(state.fight.npc.id)}
        onBack={fight.reset}
      />
    );
  }

  if (state.kind === "pending") return <FightPending opponent={nickOf(npcs.state, state.npcId)} />;

  return (
    <>
      <PoolPanel label={FIGHT_POINTS_LABEL} iconSrc={FIGHT_ICON_SRC.hit} pool={fightPoints} fullText="Punkty walki pełne" />
      {state.kind === "failed" ? <ScreenAlert>{state.message}</ScreenAlert> : null}
      <NpcRoster
        state={npcs.state}
        playerLevel={character.level}
        blockedHint={fightBlockedHint(fightPoints)}
        onRetry={npcs.retry}
        onFight={(npc) => fight.start(npc.id)}
      />
    </>
  );
}

export function OctagonScreen({ character }: { character: CharacterSheet }) {
  const { refresh } = useCharacterSheetSession();
  const fightPoints = usePoolCountdown(character.fightPoints, refresh);
  const npcs = useNpcs();
  const fight = useFight();
  const rejectedForPoints = fight.state.kind === "failed" && fight.state.reason === "no-fight-points";

  useEffect(() => {
    if (rejectedForPoints) refresh();
  }, [rejectedForPoints, refresh]);

  return (
    <GameScreenShell>
      <ScreenMain>
        <ScreenTitle label="Oktagon" art={OCTAGON_HEADER} />
        <OctagonContent character={character} fightPoints={fightPoints} npcs={npcs} fight={fight} onSettled={refresh} />
      </ScreenMain>
    </GameScreenShell>
  );
}
