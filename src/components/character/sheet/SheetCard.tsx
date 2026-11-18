import type { ReactNode } from "react";
import { SectionHeading } from "@/components/character/SectionHeading";

type SheetCardProps = {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function SheetCard({ id, title, aside, children }: SheetCardProps) {
  return (
    <section className="fl-card min-w-0 px-3 py-2.5 desk:px-4 desk:py-3" aria-labelledby={id}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <SectionHeading id={id}>{title}</SectionHeading>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
