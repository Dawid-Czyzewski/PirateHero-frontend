import type { ReactNode } from "react";

const frame = "mx-auto w-full px-4 md:px-8 xl:px-14";

export function PageFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${frame} ${className}`.trim()}>{children}</div>;
}
