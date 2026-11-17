import type { ReactNode } from "react";
import { SectionHeading } from "@/components/character/SectionHeading";

type SheetCardProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function SheetCard({ id, title, children }: SheetCardProps) {
  return (
    <section className="fl-card min-w-0 px-3 py-2.5 desk:px-4 desk:py-3" aria-labelledby={id}>
      <SectionHeading id={id}>{title}</SectionHeading>
      {children}
    </section>
  );
}
