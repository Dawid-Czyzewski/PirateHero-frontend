import Link from "next/link";
import type { ReactNode } from "react";

type SkewButtonBase = {
  children: ReactNode;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

type SkewButtonAsLink = SkewButtonBase & {
  href: string;
  type?: never;
};

type SkewButtonAsButton = SkewButtonBase & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
};

type SkewButtonProps = SkewButtonAsLink | SkewButtonAsButton;

const sizeClass = {
  md: "h-10 px-5 text-[0.68rem] tracking-[0.14em] lg:px-3 lg:text-[0.6rem] lg:tracking-[0.08em] xl:px-5 xl:text-[0.68rem] xl:tracking-[0.14em]",
  lg: "h-auto px-6 py-3.5 text-[0.78rem] tracking-[0.1em] sm:px-12 sm:py-4 sm:text-[0.9rem] sm:tracking-[0.14em] md:px-14 md:text-[1rem]",
};

const variantClass = {
  solid: "bg-red-600 hover:bg-red-700",
  outline: "border border-white/40 bg-transparent hover:bg-white/10",
};

export function SkewButton({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: SkewButtonProps) {
  const classes =
    `-skew-x-12 inline-flex items-center justify-center whitespace-nowrap font-bold uppercase text-white transition ${sizeClass[size]} ${variantClass[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        <span className="inline-block skew-x-12">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      <span className="inline-block skew-x-12">{children}</span>
    </button>
  );
}
