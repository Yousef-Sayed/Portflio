"use client";

import * as React from "react";

type Language = "en" | "ar";

interface LanguageProviderState {
  language: Language;
  setLanguage: (language: Language) => void;
  direction: "ltr" | "rtl";
}

const LanguageContext = React.createContext<LanguageProviderState | undefined>(
  undefined
);

const COOKIE_NAME = "ytech-locale";

// Cookie utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

// Helper to apply language direction to document
function applyLanguageToDocument(lang: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

function getInitialLanguage(): Language {
  // First check cookie (preferred for SSR)
  const cookieLang = getCookie(COOKIE_NAME);
  if (cookieLang === "ar" || cookieLang === "en") {
    return cookieLang;
  }

  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(getInitialLanguage);

  React.useEffect(() => {
    // Apply language direction on mount
    applyLanguageToDocument(language);
  }, [language]);

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang);

    // Persist to both storage mechanisms
    if (typeof window !== "undefined") {
      localStorage.setItem("ytech-language", lang);
      setCookie(COOKIE_NAME, lang);
    }

    // Update document attributes
    applyLanguageToDocument(lang);
  }, []);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      direction: (language === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
