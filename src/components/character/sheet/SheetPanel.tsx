import type { ReactNode } from "react";

type SheetPanelProps = {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export function SheetPanel({ id, title, className = "", children }: SheetPanelProps) {
  return (
    <section className={`rounded-md border border-white/20 bg-panel px-5 py-4 ${className}`} aria-labelledby={id}>
      <h2 className="m-0 mb-3 font-display text-2xl tracking-wider text-blood uppercase" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}
