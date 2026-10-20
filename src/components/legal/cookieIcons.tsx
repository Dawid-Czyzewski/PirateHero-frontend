import type { ReactNode } from "react";

function IconShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-5 w-5 shrink-0 text-red-600"
      fill="currentColor"
      aria-hidden
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function IconShield() {
  return (
    <IconShell label="Niezbędne">
      <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
    </IconShell>
  );
}

function IconSliders() {
  return (
    <IconShell label="Preferencje">
      <path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H183a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h81a32,32,0,0,0,62,0h33a8,8,0,0,0,0-16Zm-64,24a16,16,0,1,1,16-16A16,16,0,0,1,152,192Z" />
    </IconShell>
  );
}

function IconChart() {
  return (
    <IconShell label="Analityczne">
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16h8V136a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8v64h16V88a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h16V40a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h8A8,8,0,0,1,232,208Z" />
    </IconShell>
  );
}

function IconMegaphone() {
  return (
    <IconShell label="Marketingowe">
      <path d="M248,120a48.05,48.05,0,0,0-48-48H160V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V72H56a48.05,48.05,0,0,0-48,48,48.05,48.05,0,0,0,48,48H88v32a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V168h40a48.05,48.05,0,0,0,48-48ZM104,40h40V72H104ZM144,208H104V168h40Zm56-56H56a32,32,0,0,1,0-64H200a32,32,0,0,1,0,64Z" />
    </IconShell>
  );
}

export const COOKIE_TYPE_ITEMS: { label: string; icon: ReactNode }[] = [
  { label: "Niezbędne", icon: <IconShield /> },
  { label: "Preferencje", icon: <IconSliders /> },
  { label: "Analityczne", icon: <IconChart /> },
  { label: "Marketingowe", icon: <IconMegaphone /> },
];
