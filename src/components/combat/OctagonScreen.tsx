"use client";

import { FightArena } from "@/components/combat/fight/FightArena";
import { FightPending } from "@/components/combat/fight/FightPending";
import { NpcRoster } from "@/components/combat/NpcRoster";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { ScreenAlert } from "@/components/game/ScreenAlert";
import { ScreenMain } from "@/components/game/ScreenMain";
import type { CharacterSheet } from "@/modules/character/characterSheet";
import { useCharacterSheetSession } from "@/modules/character/hooks/CharacterSheetContext";
import { staminaWaitHint } from "@/modules/character/training";
import { FIGHT_STAMINA_COST } from "@/modules/combat/fight";
import { useFight, type FightSession } from "@/modules/combat/hooks/useFight";
import { useNpcs, type NpcsSession, type NpcsState } from "@/modules/combat/hooks/useNpcs";

const TITLE =
  "m-0 text-center font-marker text-[clamp(2.75rem,13vw,4.5rem)] leading-none text-blood uppercase [text-shadow:0_3px_0_#000,0_0_22px_rgb(225_25_45/0.35)]";

type OctagonContentProps = {
  character: CharacterSheet;
  npcs: NpcsSession;
  fight: FightSession;
  onSettled: () => void;
};

function nickOf(state: NpcsState, npcId: string): string | null {
  return state.kind === "loaded" ? (state.npcs.find(({ id }) => id === npcId)?.nick ?? null) : null;
}

function fightBlockedHint(character: CharacterSheet): string | null {
  if (character.stamina.current >= FIGHT_STAMINA_COST) return null;
  return staminaWaitHint(character.stamina, FIGHT_STAMINA_COST) ?? "Za mało Kondychy na walkę";
}

function OctagonContent({ character, npcs, fight, onSettled }: OctagonContentProps) {
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
      {state.kind === "failed" ? <ScreenAlert>{state.message}</ScreenAlert> : null}
      <NpcRoster
        state={npcs.state}
        playerLevel={character.level}
        blockedHint={fightBlockedHint(character)}
        onRetry={npcs.retry}
        onFight={(npc) => fight.start(npc.id)}
      />
    </>
  );
}

export function OctagonScreen({ character }: { character: CharacterSheet }) {
  const { refresh } = useCharacterSheetSession();
  const npcs = useNpcs();
  const fight = useFight();

  return (
    <GameScreenShell>
      <ScreenMain>
        <h1 className={TITLE}>Oktagon</h1>
        <OctagonContent character={character} npcs={npcs} fight={fight} onSettled={refresh} />
      </ScreenMain>
    </GameScreenShell>
  );
}
