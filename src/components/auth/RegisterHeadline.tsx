import Image from "next/image";

export function RegisterHeadline() {
  return (
    <Image
      src="/images/register-headline-v1.png"
      alt=""
      width={1400}
      height={700}
      priority
      sizes="(max-width: 768px) 85vw, 28rem"
      className="mx-auto h-auto w-full max-w-[17rem] select-none drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:max-w-[18.5rem]"
      aria-hidden
    />
  );
}
