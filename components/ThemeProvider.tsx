"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
  attribute?: "data-theme" | "class";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
    ? storedTheme
    : defaultTheme;
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*{transition:none!important}"),
  );
  document.head.appendChild(style);

  requestAnimationFrame(() => {
    document.head.removeChild(style);
  });
}

export function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "dark",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  const applyTheme = useCallback(
    (nextTheme: Theme) => {
      const resolved: ResolvedTheme =
        nextTheme === "system" ? (enableSystem ? getSystemTheme() : "dark") : nextTheme;
      const root = document.documentElement;

      if (disableTransitionOnChange) {
        disableTransitionsTemporarily();
      }

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
      } else {
        root.setAttribute(attribute, resolved);
      }

      root.style.colorScheme = resolved;
      setResolvedTheme(resolved);
    },
    [attribute, disableTransitionOnChange, enableSystem],
  );

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    },
    [applyTheme],
  );

  useEffect(() => {
    const storedTheme = getStoredTheme(defaultTheme);
    setThemeState(storedTheme);
    applyTheme(storedTheme);
  }, [applyTheme, defaultTheme]);

  useEffect(() => {
    if (!enableSystem || theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [applyTheme, enableSystem, theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
