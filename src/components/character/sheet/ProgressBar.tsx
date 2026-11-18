type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  fillClassName: string;
};

export function ProgressBar({ label, value, max, fillClassName }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className="h-3.5 overflow-hidden rounded-sm border border-black bg-black/60 shadow-[inset_0_1px_2px_rgb(0_0_0/0.8)]"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span
        className={`block h-full shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] transition-[width] duration-500 motion-reduce:transition-none ${fillClassName}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
