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

// Helper to apply theme to document
function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "portfolio-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  // Initialize on mount only
  React.useEffect(() => {
    setMounted(true);

    // Get stored theme or system preference
    const stored = localStorage.getItem(storageKey) as Theme | null;
    let initialTheme: Theme;

    if (stored && (stored === "dark" || stored === "light")) {
      initialTheme = stored;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "dark" : "light";
    }

    setThemeState(initialTheme);
    applyThemeToDocument(initialTheme);
  }, [storageKey]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
      applyThemeToDocument(newTheme);
    },
    [storageKey]
  );

  const value = React.useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  // Show children immediately (FOUC is prevented by the inline script in layout.tsx)
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
