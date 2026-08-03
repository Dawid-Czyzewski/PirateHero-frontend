type Props = {
  label: string;
  dropHighlight?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
};

export function ChestEmptySlot({ label, dropHighlight, onDragOver, onDrop }: Props) {
  return (
    <div
      data-chest-slot
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex h-14 items-center justify-center rounded-md px-1 py-1 text-center text-[10px] transition-all sm:h-auto sm:min-h-[5.75rem] sm:py-2 sm:text-[11px] md:min-h-[6.25rem] ${
        dropHighlight
          ? 'scale-[1.02] border-2 border-solid border-primary bg-primary/10 text-primary ring-2 ring-primary/50'
          : 'border border-dashed border-muted-foreground/30 bg-secondary/10 text-muted-foreground/60'
      }`}
      aria-label={label}
    >
      <span className="px-1">{label}</span>
    </div>
  );
}
