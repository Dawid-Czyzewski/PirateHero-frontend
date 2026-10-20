export type AboutFeature = {
  id: string;
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  text: string;
};

export const ABOUT_FEATURES: readonly AboutFeature[] = [
  {
    id: "feature-1",
    number: "01",
    title: "Trenuj i rośnij",
    image: "/images/about-card-train-v3.jpg",
    imageAlt:
      "Trening na siłowni w Freak Legends — rozwijaj siłę, szybkość i kondycję",
    text: "Ćwicz na siłowni, ulepszaj statystyki (siła, szybkość, kondycja) i odblokowuj potężne ciosy.",
  },
  {
    id: "feature-2",
    number: "02",
    title: "Rób dymy i hype",
    image: "/images/about-card-hype-v3.jpg",
    imageAlt:
      "Konferencja prasowa w Freak Legends — buduj hype i popularność zawodnika",
    text: "Bierz udział w konferencjach i programach. Prowokuj rywali, żeby zyskać fanów i większe kontrakty!",
  },
  {
    id: "feature-3",
    number: "03",
    title: "Walcz w oktagonie",
    image: "/images/about-card-fight-v3.jpg",
    imageAlt:
      "Walka PvP w oktagonie Freak Legends — starcia online z innymi graczami",
    text: "Rzucaj wyzwania innym graczom w starciach PvP i pnij się w rankingu federacji.",
  },
  {
    id: "feature-4",
    number: "04",
    title: "Zdobywaj pasy",
    image: "/images/about-card-belts-v3.jpg",
    imageAlt:
      "Pas mistrzowski Freak Legends — wygrywaj gale i zdobywaj tytuły",
    text: "Wygrywaj gale, zdobywaj unikalne pasy mistrzowskie i stwórz własną legendę!",
  },
];

export const ABOUT_PAGE_DESCRIPTION =
  "O grze Freak Legends: darmowe przeglądarkowe RPG o freak fightach. Trenuj zawodnika, buduj hype, walcz PvP w oktagonie i zdobywaj pasy mistrzowskie.";

export const ABOUT_UPDATED_AT = "2026-10-20";
