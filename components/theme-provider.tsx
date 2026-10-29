"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Theme = "system" | "light" | "dark"

export const THEME_STORAGE_KEY = "spectral-theme"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return value === "system" || value === "light" || value === "dark"
}

function resolveTheme(theme: Theme) {
  if (theme !== "system") {
    return theme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme)

  document.documentElement.classList.toggle("dark", resolved === "dark")
  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    const initial = isTheme(stored) ? stored : "system"

    setThemeState(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    if (theme !== "system") {
      return
    }

    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")

    query.addEventListener("change", handleChange)

    return () => query.removeEventListener("change", handleChange)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setThemeState(nextTheme)
    applyTheme(nextTheme)
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider")
  }

  return context
}
