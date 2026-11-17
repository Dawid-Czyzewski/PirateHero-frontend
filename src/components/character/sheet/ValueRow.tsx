import type { ReactNode } from "react";

type ValueRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function ValueRow({ icon, label, value }: ValueRowProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 border-b border-white/10 py-1.5 last:border-0">
      {icon}
      <dt className="min-w-0 flex-1 font-cond leading-tight [overflow-wrap:anywhere] text-lg font-bold tracking-[.03em] text-[#f3eadb] uppercase">{label}</dt>
      <dd className="m-0 font-cond text-2xl font-bold text-gold-light tabular-nums">{value}</dd>
    </div>
  );
}
