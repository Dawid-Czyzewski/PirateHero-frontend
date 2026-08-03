type Props = {
  src?: string;
  emoji: string;
  alt: string;
  borderClass: string;
};

export function DungeonPrepPortrait({ src, emoji, alt, borderClass }: Props) {
  return (
    <div
      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-black/40 shadow-md sm:h-24 sm:w-24 ${borderClass}`}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover object-top" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl" aria-hidden>
          {emoji}
        </span>
      )}
    </div>
  );
}
