type Props = {
  onCancel: () => void;
  label: string;
  ariaLabel: string;
};

export function MissionCancelButton({ onCancel, label, ariaLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onCancel}
      aria-label={ariaLabel}
      className="shrink-0 cursor-pointer rounded-md border border-red-700/80 bg-red-600 px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-wide text-white shadow-md transition-shadow hover:border-red-400/80 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
    >
      {label}
    </button>
  );
}
