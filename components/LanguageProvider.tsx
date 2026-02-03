"use client";

import * as React from "react";

type Language = "en" | "ar";

interface LanguageProviderState {
    language: Language;
    setLanguage: (language: Language) => void;
    direction: "ltr" | "rtl";
    t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageProviderState | undefined>(
    undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = React.useState<Language>("en");

    const setLanguage = React.useCallback((lang: Language) => {
        setLanguageState(lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    }, []);

    // Set initial direction
    React.useEffect(() => {
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = language;
    }, [language]);

    const value = React.useMemo(
        () => ({
            language,
            setLanguage,
            direction: (language === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
            t: (key: string) => key, // Placeholder for now, real translation logic happens in components via data selection
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
