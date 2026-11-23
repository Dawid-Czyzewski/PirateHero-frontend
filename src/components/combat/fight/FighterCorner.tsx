import { CharacterAvatar } from "@/components/character/avatar/CharacterAvatar";
import { GameIcon } from "@/components/game/GameIcon";
import { ProgressBar } from "@/components/game/ProgressBar";
import type { Appearance } from "@/modules/character/appearance";
import { FIGHT_ICON_SRC } from "@/modules/combat/combatAssets";

export type Blow = { id: number; damage: number };

type FighterCornerProps = {
  name: string;
  hp: number;
  maxHp: number;
  look: Appearance;
  blow: Blow | null;
  mirrored?: boolean;
};

const HP_FILL = "bg-[linear-gradient(90deg,var(--color-blood-deep),var(--color-blood))]";

export function FighterCorner({ name, hp, maxHp, look, blow, mirrored = false }: FighterCornerProps) {
  return (
    <figure className="m-0 flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <figcaption className="w-full min-w-0">
        <p className="m-0 truncate text-center font-cond text-base font-bold tracking-[.06em] text-white uppercase sm:text-lg">{name}</p>
        <ProgressBar label={`${name}: ${hp} z ${maxHp} HP`} value={hp} max={maxHp} fillClassName={HP_FILL} caption={`${hp}/${maxHp} HP`} className="h-5" />
      </figcaption>
      <div className="relative w-full max-w-44">
        <div key={`body-${blow?.id ?? "idle"}`} className={blow ? "animate-shake motion-reduce:animate-none" : undefined}>
          <CharacterAvatar appearance={look} className={mirrored ? "-scale-x-100" : undefined} sizes="(max-width: 640px) 45vw, 176px" />
        </div>
        {blow ? (
          <span
            key={`blow-${blow.id}`}
            className="absolute top-[18%] left-1/2 flex -translate-x-1/2 animate-gain items-center gap-1 motion-reduce:animate-none"
            data-testid="blow"
          >
            <GameIcon src={FIGHT_ICON_SRC.hit} size={48} />
            <span className="font-display text-4xl leading-none text-white [text-shadow:0_2px_0_#000,0_0_10px_rgb(225_25_45/0.9)]">
              -{blow.damage}
            </span>
          </span>
        ) : null}
      </div>
    </figure>
  );
}
