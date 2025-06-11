import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// en
import enCommon from "./locales/en/common.json";
import enSettings from "./locales/en/settings.json";
import enExperiments from "./locales/en/experiments.json";

// pt
import ptCommon from "./locales/pt/common.json";
import ptSettings from "./locales/pt/settings.json";
import ptExperiments from "./locales/pt/experiments.json";

const getInitialLang = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lang") || "pt";
  }
  return "pt";
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      settings: enSettings,
      experiments: enExperiments,
    },
    pt: {
      common: ptCommon,
      settings: ptSettings,
      experiments: ptExperiments,
    },
  },
  lng: getInitialLang(),
  fallbackLng: "en",
  ns: ["common", "settings", "experiments"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});
