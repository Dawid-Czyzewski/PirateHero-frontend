import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex h-12 shrink-0 items-center sm:h-[3.3rem] lg:h-10 xl:h-14"
      aria-label="Freak Legends"
    >
      <Image
        src="/images/logo-freak-legends-v2.png"
        alt="Freak Legends"
        width={240}
        height={86}
        className="!h-full !w-auto max-h-12 object-contain object-left sm:max-h-[3.3rem] lg:max-h-10 xl:max-h-14"
      />
    </Link>
  );
}
