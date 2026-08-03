type Props = {
  value: number;
  critical: boolean;
  side: 'left' | 'right';
  dodge?: boolean;
  dodgeLabel?: string;
};

export function ArenaDamageNumber({ value, critical, side, dodge, dodgeLabel }: Props) {
  const pos = side === 'left' ? { left: '18%' } : { right: '18%' };
  if (dodge) {
    return (
      <span
        className="pointer-events-none absolute top-[12%] text-base font-bold uppercase tracking-wide text-muted-foreground drop-shadow-lg animate-arena-float-up"
        style={pos}
      >
        {dodgeLabel ?? 'MISS'}
      </span>
    );
  }
  return (
    <span
      className={`pointer-events-none absolute top-[12%] text-lg font-bold drop-shadow-lg animate-arena-float-up ${
        critical ? 'text-2xl text-primary' : side === 'left' ? 'text-accent' : 'text-secondary'
      }`}
      style={pos}
    >
      {critical ? '💥' : ''}-{value}
    </span>
  );
}
