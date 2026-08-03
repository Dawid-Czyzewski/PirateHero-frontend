import { Coins } from 'lucide-react';

const RING_SM = 'h-8 w-8 rounded-full border border-[hsl(43,55%,42%)]/50 bg-[hsl(43,40%,12%)]';
const RING_MD = 'h-9 w-9 rounded-full border border-[hsl(43,55%,42%)]/50 bg-[hsl(43,40%,12%)]';
const ICON_SM = 'h-3.5 w-3.5 text-[hsl(43,78%,52%)]';
const ICON_MD = 'h-4 w-4 text-[hsl(43,78%,52%)]';

type Props = {
  size?: 'sm' | 'md';
  className?: string;
};

export function WorksCoinsInCircle({ size = 'md', className = '' }: Props) {
  const ring = size === 'sm' ? RING_SM : RING_MD;
  const icon = size === 'sm' ? ICON_SM : ICON_MD;
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${ring} ${className}`.trim()}
      aria-hidden
    >
      <Coins className={icon} strokeWidth={2} />
    </div>
  );
}
