import type { ReactNode } from "react";
import { PageFrame } from "./PageFrame";

const FEATURES: { line1: string; line2: string; icon: ReactNode }[] = [
  { line1: "Trenuj", line2: "i rozwijaj postać", icon: <IconDumbbell /> },
  { line1: "Walcz", line2: "z innymi graczami", icon: <IconFist /> },
  { line1: "Buduj", line2: "popularność", icon: <IconUsers /> },
  { line1: "Bierz udział", line2: "w konferencjach", icon: <IconMic /> },
  { line1: "Zdobywaj pasy", line2: "i wygrywaj gale", icon: <IconTrophy /> },
  { line1: "Zostań", line2: "legendą", icon: <IconCrown /> },
];

function Icon({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 256 256"
      className="h-full w-full"
      fill="currentColor"
      aria-hidden
      role="img"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function IconDumbbell() {
  return (
    <Icon label="Hantel">
      <path d="M200,64V192a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V136H104v56a16,16,0,0,1-16,16H72a16,16,0,0,1-16-16V64A16,16,0,0,1,72,48H88a16,16,0,0,1,16,16v56h48V64a16,16,0,0,1,16-16h16A16,16,0,0,1,200,64ZM36,72H32A16,16,0,0,0,16,88v32H8.27A8.18,8.18,0,0,0,0,127.47,8,8,0,0,0,8,136h8v32a16,16,0,0,0,16,16h4a4,4,0,0,0,4-4V76A4,4,0,0,0,36,72Zm220,55.47a8.18,8.18,0,0,0-8.25-7.47H240V88a16,16,0,0,0-16-16h-4a4,4,0,0,0-4,4V180a4,4,0,0,0,4,4h4a16,16,0,0,0,16-16V136h8A8,8,0,0,0,256,127.47Z" />
    </Icon>
  );
}

function IconFist() {
  return (
    <Icon label="Pięść">
      <path d="M232,120v8A104,104,0,0,1,127.63,232c-54-.19-98-42.06-103.12-94.78a4,4,0,0,1,5.56-4A35.94,35.94,0,0,0,72,122.59a35.92,35.92,0,0,0,53.94,2.33,40.36,40.36,0,0,0,12.87,13A47.94,47.94,0,0,0,120,176a8,8,0,0,0,8.67,8,8.21,8.21,0,0,0,7.33-8.26A32,32,0,0,1,168,144a8,8,0,0,0,8-8.53,8.18,8.18,0,0,0-8.25-7.47H160a24,24,0,0,1-24-24V88h64A32,32,0,0,1,232,120ZM44.73,120C55.57,119.6,64,110.37,64,99.52v-23C64,65.63,55.57,56.4,44.73,56A20,20,0,0,0,24,76v24A20,20,0,0,0,44.73,120Zm56,0c10.84-.39,19.27-9.62,19.27-20.47v-47c0-10.85-8.43-20.08-19.27-20.47A20,20,0,0,0,80,52v48A20,20,0,0,0,100.73,120ZM176,52a20,20,0,0,0-20.73-20C144.43,32.4,136,41.63,136,52.48V72h36a4,4,0,0,0,4-4Z" />
    </Icon>
  );
}

function IconUsers() {
  return (
    <Icon label="Społeczność">
      <path d="M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z" />
    </Icon>
  );
}

function IconMic() {
  return (
    <Icon label="Mikrofon">
      <path d="M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z" />
    </Icon>
  );
}

function IconTrophy() {
  return (
    <Icon label="Puchar">
      <path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z" />
    </Icon>
  );
}

function IconCrown() {
  return (
    <Icon label="Korona">
      <path d="M239.75,90.81c0,.11,0,.21-.07.32L217,195a16,16,0,0,1-15.72,13H54.71A16,16,0,0,1,39,195L16.32,91.13c0-.11-.05-.21-.07-.32A16,16,0,0,1,44,77.39l33.67,36.29,35.8-80.29a1,1,0,0,0,0-.1,16,16,0,0,1,29.06,0,1,1,0,0,0,0,.1l35.8,80.29L212,77.39a16,16,0,0,1,27.71,13.42Z" />
    </Icon>
  );
}

export function FeatureStrip() {
  return (
    <section
      id="rozgrywka"
      className="relative z-30 w-full border-y border-white/15 bg-black/80 backdrop-blur-sm"
      aria-label="Główne elementy gry"
    >
      <PageFrame>
      <ul className="mx-auto flex w-full flex-col sm:flex-row sm:flex-wrap lg:w-max lg:max-w-full lg:flex-nowrap lg:items-stretch lg:justify-center">
        {FEATURES.map((item, index) => (
          <li
            key={item.line1}
            className={[
              "flex flex-1 items-center justify-center py-5 sm:min-w-[33.33%] sm:justify-start sm:px-3 sm:py-6 lg:min-w-0 lg:flex-none lg:justify-start lg:px-4 lg:py-5 xl:px-5 xl:py-6",
              index > 0 ? "border-t border-white/15 sm:border-t-0" : "",
              index % 3 !== 0 ? "sm:border-l sm:border-white/15" : "",
              index !== 0 ? "lg:border-l lg:border-white/15" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex w-[15.5rem] items-center gap-3 sm:w-auto lg:gap-2 xl:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-white lg:h-7 lg:w-7 xl:h-9 xl:w-9">
                {item.icon}
              </span>
              <p className="min-w-0 flex-1 text-[0.65rem] font-extrabold uppercase leading-[1.15] tracking-[0.04em] text-white lg:text-[0.58rem] lg:tracking-[0.02em] xl:text-[0.7rem] xl:tracking-[0.05em]">
                {item.line1}
                <span className="mt-0.5 block font-bold">
                  {item.line2}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      </PageFrame>
    </section>
  );
}
