export const CONTACT_TOPICS = [
  { value: "konto", label: "Konto / logowanie" },
  { value: "rubiny", label: "Problem z rubinami" },
  { value: "platnosci", label: "Płatności" },
  { value: "blad", label: "Zgłoszenie błędu" },
  { value: "wspolpraca", label: "Współpraca / media" },
  { value: "inne", label: "Inne" },
] as const;

export const contactFieldClass =
  "w-full border border-red-600/50 bg-[#0c0c0c] px-3.5 py-3 text-[0.9rem] uppercase tracking-[0.06em] text-white placeholder:text-zinc-500 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600/40 sm:py-3.5 sm:text-[0.95rem]";
