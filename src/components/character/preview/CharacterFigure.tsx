"use client";

import Image from "next/image";
import {
  LAYER_STACK,
  appearanceLayerSrc,
  type CharacterLayer,
} from "@/modules/character/layerAssets";
import type { Appearance, AppearancePart } from "@/modules/character/appearance";

type CharacterFigureProps = {
  appearance: Appearance;
  label?: string;
  animated?: boolean;
  preload?: boolean;
  className?: string;
  focusPart?: AppearancePart;
  sizes?: string;
};

const POP = "animate-layer-pop motion-reduce:animate-none";

const FOCUS_FRAME: Record<AppearancePart, string> = {
  face: "origin-[50%_12.5%] [transform:translateY(37.5%)_scale(3.1)]",
  hair: "origin-[50%_10%] [transform:translateY(40%)_scale(2.5)]",
  beard: "origin-[50%_15%] [transform:translateY(35%)_scale(2.8)]",
  tattoo: "origin-[50%_27%] [transform:translateY(23%)_scale(1.55)]",
  skin: "origin-[50%_24%] [transform:translateY(26%)_scale(1.6)]",
};

function LayerImage({
  layer,
  appearance,
  animated,
  priority,
  sizes,
}: {
  layer: CharacterLayer;
  appearance: Appearance;
  animated: boolean;
  priority: boolean;
  sizes: string;
}) {
  const variant = layer === "skin" ? appearance.skin : appearance[layer];
  return (
    <span
      data-layer={layer}
      data-variant={String(variant)}
      className={`absolute inset-0 ${animated ? POP : ""}`}
    >
      <Image
        src={appearanceLayerSrc(appearance, layer)}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain object-bottom"
      />
    </span>
  );
}

export function CharacterFigure({
  appearance,
  label,
  animated = false,
  preload = false,
  className,
  focusPart,
  sizes = "(max-width: 900px) 70vw, 480px",
}: CharacterFigureProps) {
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };
  const focusClass = focusPart ? FOCUS_FRAME[focusPart] : "";

  return (
    <div className={`relative aspect-[2/3] overflow-hidden ${className ?? ""}`} {...a11y}>
      <div className={`absolute inset-0 ${focusClass}`}>
        {LAYER_STACK.map((layer, index) => (
          <LayerImage
            key={`${layer}-${layer === "skin" ? appearance.skin : appearance[layer]}`}
            layer={layer}
            appearance={appearance}
            animated={animated}
            priority={preload || index === 0}
            sizes={sizes}
          />
        ))}
      </div>
    </div>
  );
}
