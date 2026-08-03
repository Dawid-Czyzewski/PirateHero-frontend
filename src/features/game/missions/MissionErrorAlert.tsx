type Props = {
  message: string | null;
  onDismiss: () => void;
  closeLabel: string;
};

export function MissionErrorAlert({ message, onDismiss, closeLabel }: Props) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100"
    >
      {message}
      <button type="button" className="ml-3 cursor-pointer underline" onClick={onDismiss}>
        {closeLabel}
      </button>
    </div>
  );
}
