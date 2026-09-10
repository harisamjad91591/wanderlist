import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Union type representing allowed global application color schemes.
 */
export type Theme = "light" | "dark"

/**
 * Palette configuration array marked immutable for exact literal type inference.
 */
export const ACCENT_COLORS = [
  { id: "teal", name: "Teal", hex: "#0d9488", ghost: "rgba(13, 148, 136, 0.12)" },
  { id: "indigo", name: "Indigo", hex: "#6366f1", ghost: "rgba(99, 102, 241, 0.12)" },
  { id: "rose", name: "Rose", hex: "#f43f5e", ghost: "rgba(244, 63, 94, 0.12)" },
  { id: "emerald", name: "Emerald", hex: "#10b981", ghost: "rgba(16, 185, 129, 0.12)" },
  { id: "violet", name: "Violet", hex: "#8b5cf6", ghost: "rgba(139, 92, 246, 0.12)" },
  { id: "amber", name: "Amber", hex: "#f59e0b", ghost: "rgba(245, 158, 11, 0.12)" },
] as const

/**
 * Inferred union type of valid accent color identifiers.
 */
export type AccentColorId = (typeof ACCENT_COLORS)[number]["id"]

/**
 * Internal state contract for theme persistence.
 */
export interface ThemeState {
  theme: Theme
  accent: AccentColorId
}

/**
 * Store action contracts for modifying active theme and dynamic CSS variables.
 */
export interface ThemeActions {
  toggleTheme: () => void
  setTheme: (newTheme: Theme) => void
  setAccent: (accentId: AccentColorId) => void
}

export type ThemeStore = ThemeState & ThemeActions

/**
 * Synchronizes DOM root element classes and dynamic CSS variable properties with state updates.
 * Includes explicit guard check for SSR compatibility.
 * 
 * @param theme - Active scheme ("light" | "dark")
 * @param accentId - Selected accent identifier
 */
function applyDocumentTheme(theme: Theme, accentId: AccentColorId): void {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }

  const accent = ACCENT_COLORS.find((c) => c.id === accentId) ?? ACCENT_COLORS[0]
  root.style.setProperty("--teal", accent.hex)
  root.style.setProperty("--teal-ghost", accent.ghost)
}

/**
 * Persistent Zustand theme store for managing global light/dark modes and theme variables.
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      accent: "teal",

      toggleTheme: () => {
        const nextTheme: Theme = get().theme === "dark" ? "light" : "dark"
        set({ theme: nextTheme })
        applyDocumentTheme(nextTheme, get().accent)
      },

      setTheme: (newTheme) => {
        set({ theme: newTheme })
        applyDocumentTheme(newTheme, get().accent)
      },

      setAccent: (accentId) => {
        set({ accent: accentId })
        applyDocumentTheme(get().theme, accentId)
      },
    }),
    {
      name: "wanderlist:theme-customizer",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyDocumentTheme(state.theme, state.accent)
        }
      },
    }
  )
)

/**
 * Convenience hook isolating theme selectors for components.
 */
export function useTheme() {
  const theme = useThemeStore((state) => state.theme)
  const accent = useThemeStore((state) => state.accent)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const setAccent = useThemeStore((state) => state.setAccent)

  return { theme, accent, toggleTheme, setTheme, setAccent }
}