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

function IconEnvelope() {
  return (
    <IconShell label="E-mail">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19Z" />
    </IconShell>
  );
}

function IconUser() {
  return (
    <IconShell label="Konto">
      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    </IconShell>
  );
}

function IconChart() {
  return (
    <IconShell label="Statystyki">
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1,0-16h8V136a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8v64h16V88a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h16V40a8,8,0,0,1,8-8h32a8,8,0,0,1,8,8V200h8A8,8,0,0,1,232,208Z" />
    </IconShell>
  );
}

function IconController() {
  return (
    <IconShell label="Dane rejestracyjne">
      <path d="M247.51,124.28l-30.94-49.5A32,32,0,0,0,189.86,60H66.14a32,32,0,0,0-26.71,14.78l-30.94,49.5A15.87,15.87,0,0,0,8,131.72v36.13A24.17,24.17,0,0,0,32.17,192H56a40,40,0,0,0,40-40h64a40,40,0,0,0,40,40h23.83A24.17,24.17,0,0,0,248,167.85V131.72A15.87,15.87,0,0,0,247.51,124.28ZM184,148a12,12,0,1,1,12-12A12,12,0,0,1,184,148ZM72,148H56a12,12,0,0,1,0-24H72a12,12,0,0,1,0,24Zm16-36H72a12,12,0,0,1,0-24h16a12,12,0,0,1,0,24Z" />
    </IconShell>
  );
}

function IconPin() {
  return (
    <IconShell label="Adresy IP">
      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
    </IconShell>
  );
}

function IconCookie() {
  return (
    <IconShell label="Cookies">
      <path d="M225.85,102.18a8,8,0,0,0-7.57-1.34,24,24,0,0,1-23.8-41.88,8,8,0,0,0-3.32-14.5A104,104,0,1,0,225.85,102.18ZM128,216A88,88,0,1,1,192.5,70.83a40,40,0,0,0,34.47,43.42A88.12,88.12,0,0,1,128,216Zm-8-88a12,12,0,1,1-12-12A12,12,0,0,1,120,128Zm-4,48a12,12,0,1,1-12-12A12,12,0,0,1,116,176Zm48-24a12,12,0,1,1-12-12A12,12,0,0,1,164,152Z" />
    </IconShell>
  );
}

export const PRIVACY_DATA_ITEMS: { label: string; icon: ReactNode }[] = [
  { label: "E-mail", icon: <IconEnvelope /> },
  { label: "Nick i dane konta", icon: <IconUser /> },
  { label: "Dane rejestracyjne", icon: <IconController /> },
  { label: "Statystyki o grze", icon: <IconChart /> },
  { label: "Adresy IP i logi", icon: <IconPin /> },
  { label: "Cookies / urządzenie", icon: <IconCookie /> },
];
