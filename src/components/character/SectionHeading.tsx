import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  children: ReactNode;
};

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2
      className="m-0 mb-1.5 flex items-center gap-2 font-cond text-sm font-bold tracking-[.14em] text-gold uppercase after:h-px after:flex-1 after:bg-[linear-gradient(90deg,rgba(240,195,90,.6),transparent)] desk:text-base"
      id={id}
    >
      {children}
    </h2>
  );
}
