import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationPL from "./locales/pl/translation.json";
import questsEN from "./locales/en/quests.json";
import questsPL from "./locales/pl/quests.json";
import legalEN from "./locales/en/legal.json";
import legalPL from "./locales/pl/legal.json";
import landingEN from "./locales/en/landing.json";
import landingPL from "./locales/pl/landing.json";
import aboutEN from "./locales/en/about.json";
import aboutPL from "./locales/pl/about.json";
import { DEFAULT_GAME_SERVER_ID, setStoredGameServerId } from "./features/game/settings/gameServers";

if (typeof window !== "undefined") {
  setStoredGameServerId(DEFAULT_GAME_SERVER_ID);
}

const savedLanguage = localStorage.getItem("language");
const fallbackLanguage = "en";


const translationEnBundle = {
  ...translationEN,
  quests: questsEN,
  legal: legalEN,
  landing: landingEN,
  aboutPage: aboutEN,
};

const translationPlBundle = {
  ...translationPL,
  quests: questsPL,
  legal: legalPL,
  landing: landingPL,
  aboutPage: aboutPL,
};

const resources = {
  en: { translation: translationEnBundle },
  pl: { translation: translationPlBundle },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || fallbackLanguage,
    fallbackLng: fallbackLanguage,
    supportedLngs: ["en", "pl"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: [],
    },
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false,
    keySeparator: '.',
    nsSeparator: false,
    missingKeyHandler: (lng, _ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] missing key "${key}" (lng=${lng})`);
      }
      return key;
    },
  });

export default i18n;
