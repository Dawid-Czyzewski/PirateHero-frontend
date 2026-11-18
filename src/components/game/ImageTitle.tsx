import Image from "next/image";

type TitleArt = { src: string; width: number; height: number };

type ImageTitleProps = {
  label: string;
  art: TitleArt;
  className: string;
};

export function ImageTitle({ label, art, className }: ImageTitleProps) {
  return (
    <>
      <span className="sr-only">{label}</span>
      <Image src={art.src} alt="" width={art.width} height={art.height} priority className={`mx-auto h-auto ${className}`} />
    </>
  );
}
