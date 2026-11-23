import type { ReactNode } from "react";

export function ScreenAlert({ children }: { children: ReactNode }) {
  return (
    <div className="m-0 border-l-4 border-blood bg-black/70 px-3 py-2 font-cond text-base font-semibold text-white" role="alert">
      {children}
    </div>
  );
}
