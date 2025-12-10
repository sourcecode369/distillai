import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "../locales/en/common.json";
import enLanding from "../locales/en/landing.json";
import enAuth from "../locales/en/auth.json";
import enApp from "../locales/en/app.json";
import enAdmin from "../locales/en/admin.json";
import enHeader from "../locales/en/header.json";
import enSidebar from "../locales/en/sidebar.json";
import enHandbook from "../locales/en/handbook.json";
import enNotification from "../locales/en/notification.json";
import enBookmark from "../locales/en/bookmark.json";
import enSearch from "../locales/en/search.json";
import enLanguage from "../locales/en/language.json";
import enQuiz from "../locales/en/quiz.json";

import deCommon from "../locales/de/common.json";
import deLanding from "../locales/de/landing.json";
import deAuth from "../locales/de/auth.json";
import deApp from "../locales/de/app.json";
import deAdmin from "../locales/de/admin.json";
import deHeader from "../locales/de/header.json";
import deSidebar from "../locales/de/sidebar.json";
import deHandbook from "../locales/de/handbook.json";
import deNotification from "../locales/de/notification.json";
import deBookmark from "../locales/de/bookmark.json";
import deSearch from "../locales/de/search.json";
import deLanguage from "../locales/de/language.json";
import deQuiz from "../locales/de/quiz.json";

import esCommon from "../locales/es/common.json";
import esLanding from "../locales/es/landing.json";
import esAuth from "../locales/es/auth.json";
import esApp from "../locales/es/app.json";
import esAdmin from "../locales/es/admin.json";
import esHeader from "../locales/es/header.json";
import esSidebar from "../locales/es/sidebar.json";
import esHandbook from "../locales/es/handbook.json";
import esNotification from "../locales/es/notification.json";
import esBookmark from "../locales/es/bookmark.json";
import esSearch from "../locales/es/search.json";
import esLanguage from "../locales/es/language.json";
import esQuiz from "../locales/es/quiz.json";

import frCommon from "../locales/fr/common.json";
import frLanding from "../locales/fr/landing.json";
import frAuth from "../locales/fr/auth.json";
import frApp from "../locales/fr/app.json";
import frAdmin from "../locales/fr/admin.json";
import frHeader from "../locales/fr/header.json";
import frSidebar from "../locales/fr/sidebar.json";
import frHandbook from "../locales/fr/handbook.json";
import frNotification from "../locales/fr/notification.json";
import frBookmark from "../locales/fr/bookmark.json";
import frSearch from "../locales/fr/search.json";
import frLanguage from "../locales/fr/language.json";
import frQuiz from "../locales/fr/quiz.json";

import itCommon from "../locales/it/common.json";
import itLanding from "../locales/it/landing.json";
import itAuth from "../locales/it/auth.json";
import itApp from "../locales/it/app.json";
import itAdmin from "../locales/it/admin.json";
import itHeader from "../locales/it/header.json";
import itSidebar from "../locales/it/sidebar.json";
import itHandbook from "../locales/it/handbook.json";
import itNotification from "../locales/it/notification.json";
import itBookmark from "../locales/it/bookmark.json";
import itSearch from "../locales/it/search.json";
import itLanguage from "../locales/it/language.json";
import itQuiz from "../locales/it/quiz.json";

import ptCommon from "../locales/pt/common.json";
import ptLanding from "../locales/pt/landing.json";
import ptAuth from "../locales/pt/auth.json";
import ptApp from "../locales/pt/app.json";
import ptAdmin from "../locales/pt/admin.json";
import ptHeader from "../locales/pt/header.json";
import ptSidebar from "../locales/pt/sidebar.json";
import ptHandbook from "../locales/pt/handbook.json";
import ptNotification from "../locales/pt/notification.json";
import ptBookmark from "../locales/pt/bookmark.json";
import ptSearch from "../locales/pt/search.json";
import ptLanguage from "../locales/pt/language.json";
import ptQuiz from "../locales/pt/quiz.json";

// Helper function to detect language from browser or localStorage
const getInitialLanguage = () => {
  // 1. Check localStorage first
  const savedLang = localStorage.getItem("ai-handbooks-lang");
  if (savedLang && ["en", "de", "es", "fr", "it", "pt"].includes(savedLang)) {
    return savedLang;
  }

  // 2. Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split("-")[0].toLowerCase();

  // Map browser language to supported languages
  const langMap = {
    en: "en",
    de: "de",
    es: "es",
    fr: "fr",
    it: "it",
    pt: "pt",
  };

  if (langMap[langCode]) {
    return langMap[langCode];
  }

  // 3. Fallback to English
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      landing: enLanding,
      auth: enAuth,
      app: enApp,
      admin: enAdmin,
      header: enHeader,
      sidebar: enSidebar,
      handbook: enHandbook,
      notification: enNotification,
      bookmark: enBookmark,
      search: enSearch,
      language: enLanguage,
      quiz: enQuiz,
    },
    de: {
      common: deCommon,
      landing: deLanding,
      auth: deAuth,
      app: deApp,
      admin: deAdmin,
      header: deHeader,
      sidebar: deSidebar,
      handbook: deHandbook,
      notification: deNotification,
      bookmark: deBookmark,
      search: deSearch,
      language: deLanguage,
      quiz: deQuiz,
    },
    es: {
      common: esCommon,
      landing: esLanding,
      auth: esAuth,
      app: esApp,
      admin: esAdmin,
      header: esHeader,
      sidebar: esSidebar,
      handbook: esHandbook,
      notification: esNotification,
      bookmark: esBookmark,
      search: esSearch,
      language: esLanguage,
      quiz: esQuiz,
    },
    fr: {
      common: frCommon,
      landing: frLanding,
      auth: frAuth,
      app: frApp,
      admin: frAdmin,
      header: frHeader,
      sidebar: frSidebar,
      handbook: frHandbook,
      notification: frNotification,
      bookmark: frBookmark,
      search: frSearch,
      language: frLanguage,
      quiz: frQuiz,
    },
    it: {
      common: itCommon,
      landing: itLanding,
      auth: itAuth,
      app: itApp,
      admin: itAdmin,
      header: itHeader,
      sidebar: itSidebar,
      handbook: itHandbook,
      notification: itNotification,
      bookmark: itBookmark,
      search: itSearch,
      language: itLanguage,
      quiz: itQuiz,
    },
    pt: {
      common: ptCommon,
      landing: ptLanding,
      auth: ptAuth,
      app: ptApp,
      admin: ptAdmin,
      header: ptHeader,
      sidebar: ptSidebar,
      handbook: ptHandbook,
      notification: ptNotification,
      bookmark: ptBookmark,
      search: ptSearch,
      language: ptLanguage,
      quiz: ptQuiz,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "de", "es", "fr", "it", "pt"],
  defaultNS: "common",
  ns: ["common", "landing", "auth", "app", "admin", "header", "sidebar", "handbook", "notification", "bookmark", "search", "language", "quiz"],
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense to avoid loading issues
  },
});

// Listen for language changes and save to localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("ai-handbooks-lang", lng);
});

export default i18n;

