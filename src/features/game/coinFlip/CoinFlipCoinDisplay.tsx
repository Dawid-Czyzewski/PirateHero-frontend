import type { CoinFlipPlayResponse } from '@/types/coinFlip';

type CoinFlipCoinDisplayProps = {
  isFlipping: boolean;
  lastResult: CoinFlipPlayResponse | null;
  headsLabel: string;
  tailsLabel: string;
};

type PirateCoinFacesProps = {
  headsLabel: string;
  tailsLabel: string;
};

function PirateCoinFaces({ headsLabel, tailsLabel }: PirateCoinFacesProps) {
  return (
    <>
      <div
        className="fg-coin-face absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full border-[6px] border-[hsl(22_42%_12%)] shadow-[inset_0_0_40px_rgba(0,0,0,0.55),inset_0_3px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.65)] [transform:translateZ(8px)]"
        style={{
          background: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              hsl(38 42% 28%) 0deg 14deg,
              hsl(32 38% 22%) 14deg 28deg
            ),
            radial-gradient(ellipse 85% 60% at 45% 35%, hsl(43 48% 44%) 0%, transparent 58%),
            radial-gradient(circle at 50% 100%, hsl(20 45% 10%) 0%, hsl(28 40% 18%) 45%, hsl(22 38% 12%) 100%)
          `,
        }}
      >
        <span
          className="pointer-events-none absolute top-4 select-none text-[1.85rem] leading-none text-black/40 drop-shadow-sm sm:top-5 sm:text-[2.1rem]"
          aria-hidden
        >
          ☠
        </span>
        <span className="pointer-events-none select-none font-heading text-[clamp(1.45rem,5.5vw,2.35rem)] font-black uppercase tracking-[0.14em] text-[hsl(43_30%_88%)] drop-shadow-[0_2px_0_rgba(0,0,0,0.85)] sm:text-[clamp(1.6rem,4.2vw,2.5rem)]">
          {headsLabel}
        </span>
        <span className="pointer-events-none mt-2 block h-px w-16 max-w-[42%] bg-black/30" aria-hidden />
      </div>

      <div
        className="fg-coin-face absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full border-[6px] border-[hsl(195_28%_10%)] shadow-[inset_0_0_44px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.05),0_10px_28px_rgba(0,0,0,0.65)] [transform:rotateY(180deg)_translateZ(8px)]"
        style={{
          background: `
            repeating-conic-gradient(
              from 180deg at 50% 50%,
              hsl(175 22% 22%) 0deg 18deg,
              hsl(195 24% 16%) 18deg 36deg
            ),
            radial-gradient(ellipse 80% 55% at 55% 32%, hsl(168 16% 34%) 0%, transparent 55%),
            radial-gradient(circle at 50% 110%, hsl(200 35% 8%) 0%, hsl(188 28% 14%) 100%)
          `,
        }}
      >
        <span
          className="pointer-events-none absolute top-4 select-none text-[1.75rem] leading-none text-teal-950/45 sm:top-5 sm:text-[2rem]"
          aria-hidden
        >
          ⚓
        </span>
        <span className="pointer-events-none select-none font-heading text-[clamp(1.35rem,5.2vw,2.2rem)] font-black uppercase tracking-[0.12em] text-[hsl(165_18%_78%)] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] sm:text-[clamp(1.5rem,4vw,2.35rem)]">
          {tailsLabel}
        </span>
        <span className="pointer-events-none mt-2 block h-px w-16 max-w-[42%] bg-teal-950/35" aria-hidden />
      </div>

      <div
        className="pointer-events-none absolute inset-1.5 rounded-full border border-black/35 shadow-[inset_0_0_20px_rgba(0,0,0,0.45)]"
        aria-hidden
      />
    </>
  );
}

export function CoinFlipCoinDisplay({
  isFlipping,
  lastResult,
  headsLabel,
  tailsLabel,
}: CoinFlipCoinDisplayProps) {
  const tailsUp = Boolean(lastResult) && !isFlipping && lastResult.outcome === 'tails';

  return (
    <div
      className="relative aspect-square h-[min(70vw,20rem)] w-[min(70vw,20rem)] sm:h-[min(70svh,22rem)] sm:w-[min(70svh,22rem)]"
      aria-live="polite"
      aria-busy={isFlipping}
    >
      <div className="relative h-full w-full [perspective:1400px]">
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-200 ${
            isFlipping ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!isFlipping}
        >
          <div className="fg-coin-y-tumble relative h-full w-full">
            <PirateCoinFaces headsLabel={headsLabel} tailsLabel={tailsLabel} />
          </div>
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isFlipping ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={isFlipping}
        >
          <div
            className={[
              'fg-coin-preserve-3d relative h-full w-full duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              tailsUp ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]',
            ].join(' ')}
          >
            <PirateCoinFaces headsLabel={headsLabel} tailsLabel={tailsLabel} />
            {!lastResult && (
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                aria-hidden
              >
                <span className="rounded-full border border-black/50 bg-black/55 px-5 py-3 font-heading text-4xl font-black text-amber-100/95 shadow-md backdrop-blur-[1px] sm:text-5xl">
                  ?
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
