const DESK =
  "(min-width: 900px) and (min-aspect-ratio: 1/1)" as const;

type ArtPictureProps = {
  srcD: string;
  srcM: string;
  alt: string;
  className?: string;
  widthM: number;
  heightM: number;
  widthD: number;
  heightD: number;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

/** Desktop/mobile <picture> from mockup cuts (no next/image). */
export function ArtPicture({
  srcD,
  srcM,
  alt,
  className,
  widthM,
  heightM,
  widthD,
  heightD,
  loading = "lazy",
  fetchPriority,
}: ArtPictureProps) {
  return (
    <picture className={className}>
      <source media={DESK} srcSet={srcD} width={widthD} height={heightD} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcM}
        width={widthM}
        height={heightM}
        alt={alt}
        decoding="async"
        loading={loading}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}

export { DESK };
