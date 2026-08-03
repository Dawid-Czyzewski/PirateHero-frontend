import { Compass } from 'lucide-react';

const RING_SM = 'h-8 w-8 rounded-full border border-primary/40 bg-primary/10';
const RING_MD = 'h-9 w-9 rounded-full border border-primary/40 bg-primary/10';
const ICON_SM = 'h-3.5 w-3.5 text-primary/70';
const ICON_MD = 'h-4 w-4 text-primary/70';

type Props = {
  size?: 'sm' | 'md';
  className?: string;
};

export function MissionCompassInCircle({ size = 'md', className = '' }: Props) {
  const ring = size === 'sm' ? RING_SM : RING_MD;
  const icon = size === 'sm' ? ICON_SM : ICON_MD;
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${ring} ${className}`.trim()}
      aria-hidden
    >
      <Compass className={icon} strokeWidth={2} />
    </div>
  );
}
