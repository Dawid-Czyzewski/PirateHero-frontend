type ExperienceBarProps = {
  current: number;
  max: number;
  label?: string;
  className?: string;
  heightClassName?: string;
};

export function ExperienceBar({
  current,
  max,
  label = 'XP',
  className = '',
  heightClassName = 'h-5',
}: ExperienceBarProps) {
  const safeMax = Math.max(1, max);
  const percent = Math.max(0, Math.min(100, Math.round((current / safeMax) * 100)));

  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-full border border-border/40 bg-[hsl(220,20%,14%)] ${heightClassName} ${className}`.trim()}
    >
      <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all" style={{ width: `${percent}%` }} />
      <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-1 text-[10px] font-heading font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]">
        {current.toLocaleString()} / {max.toLocaleString()} {label}
      </span>
    </div>
  );
}
