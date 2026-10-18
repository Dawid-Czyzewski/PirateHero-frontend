import Link from "next/link";
import type { ReactNode } from "react";

type SkewButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const sizeClass = {
  md: "h-10 px-5 text-[0.68rem] tracking-[0.14em] lg:px-3 lg:text-[0.6rem] lg:tracking-[0.08em] xl:px-5 xl:text-[0.68rem] xl:tracking-[0.14em]",
  lg: "h-auto px-12 py-4 text-[0.9rem] tracking-[0.14em] sm:px-14 sm:text-[1rem]",
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
}: SkewButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`-skew-x-12 inline-flex items-center justify-center whitespace-nowrap font-bold uppercase text-white transition ${sizeClass[size]} ${variantClass[variant]} ${className}`.trim()}
    >
      <span className="inline-block skew-x-12">{children}</span>
    </Link>
  );
}
