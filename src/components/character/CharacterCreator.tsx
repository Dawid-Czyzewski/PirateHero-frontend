"use client";

import Image from "next/image";
import { CreationStatusLine } from "@/components/character/CreationStatusLine";
import { CreatorActions } from "@/components/character/CreatorActions";
import { AvatarStage } from "@/components/character/avatar/AvatarStage";
import { AppearancePicker } from "@/components/character/creator/AppearancePicker";
import { StartingStats } from "@/components/character/creator/StartingStats";
import { GameScreenShell } from "@/components/game/GameScreenShell";
import { StageLayout } from "@/components/game/StageLayout";
import { useAppearance } from "@/modules/character/hooks/useAppearance";
import { useCharacterCreation } from "@/modules/character/hooks/useCharacterCreation";
import { CREATOR_HEADER_SRC } from "@/modules/character/layerAssets";

function CreatorTitle() {
  return (
    <>
      <span className="sr-only">Stwórz swojego freaka</span>
      <Image
        src={CREATOR_HEADER_SRC}
        alt=""
        width={1200}
        height={490}
        priority
        className="mx-auto h-auto w-[min(100%,calc((100dvh-30rem)*1.6))] min-w-[60%] animate-hero-in motion-reduce:animate-none desk:w-[min(100%,max(14rem,calc((100dvh-40rem)*1.8)))] desk:min-w-0"
      />
    </>
  );
}

export function CharacterCreator({ nick }: { nick: string }) {
  const editor = useAppearance();
  const creation = useCharacterCreation();

  return (
    <GameScreenShell label="Kreator zawodnika">
      <StageLayout
        title={<CreatorTitle />}
        stage={<AvatarStage nick={nick} appearance={editor.appearance} rolls={editor.rolls} animated />}
        reserveBottomBar
        panelClassName="fl-panel gap-3 p-[calc(26*var(--k))] desk:gap-[clamp(0.4rem,1.3vh,0.9rem)] desk:p-[calc(30*var(--k))]"
      >
        <AppearancePicker
          appearance={editor.appearance}
          activePart={editor.activePart}
          selectPart={editor.selectPart}
          choose={editor.choose}
          errors={creation.errors}
        />
        <StartingStats />
        <CreationStatusLine status={creation.status} onRetry={() => void creation.submit(editor.appearance)} />
        <CreatorActions
          creating={creation.submitting}
          onRandomize={editor.randomize}
          onCreate={() => void creation.submit(editor.appearance)}
        />
      </StageLayout>
    </GameScreenShell>
  );
}
