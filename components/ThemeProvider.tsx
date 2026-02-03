"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
    undefined
);

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "portfolio-theme",
}: ThemeProviderProps) {
    const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
    const [mounted, setMounted] = React.useState(false);

    // Handle initial mount and get stored theme
    React.useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(storageKey) as Theme | null;
        if (stored && (stored === "dark" || stored === "light")) {
            setThemeState(stored);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setThemeState(prefersDark ? "dark" : "light");
        }
    }, [storageKey]);

    // Apply theme class to document
    React.useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        // Remove both classes first
        root.classList.remove("light", "dark");

        // Add the current theme class
        root.classList.add(theme);

        // Also set a data attribute for additional styling hooks
        root.setAttribute("data-theme", theme);
    }, [theme, mounted]);

    const setTheme = React.useCallback((newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    }, [storageKey]);

    const value = React.useMemo(
        () => ({ theme, setTheme }),
        [theme, setTheme]
    );

    // Prevent flash by rendering a hidden version first
    if (!mounted) {
        return (
            <ThemeProviderContext.Provider value={value}>
                <div style={{ visibility: "hidden" }}>{children}</div>
            </ThemeProviderContext.Provider>
        );
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme() {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}
