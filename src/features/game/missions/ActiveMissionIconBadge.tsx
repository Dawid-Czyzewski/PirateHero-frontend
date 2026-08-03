import { Swords } from 'lucide-react';

const GOLD_RING = 'border-2 border-[hsl(43,65%,42%)] bg-gradient-to-b from-[hsl(43,40%,18%)] to-[hsl(38,35%,12%)] shadow-[0_0_20px_rgba(212,175,55,0.2)]';

export function ActiveMissionIconBadge() {
  return (
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${GOLD_RING}`}
      aria-hidden
    >
      <Swords className="h-7 w-7 text-[hsl(43,78%,55%)]" strokeWidth={2} />
    </div>
  );
}
