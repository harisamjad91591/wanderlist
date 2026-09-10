import { create } from "zustand"
import { persist } from "zustand/middleware"

export const ACCENT_COLORS = [
  { id: "teal", name: "Teal", hex: "#0d9488", ghost: "rgba(13, 148, 136, 0.12)" },
  { id: "indigo", name: "Indigo", hex: "#6366f1", ghost: "rgba(99, 102, 241, 0.12)" },
  { id: "rose", name: "Rose", hex: "#f43f5e", ghost: "rgba(244, 63, 94, 0.12)" },
  { id: "emerald", name: "Emerald", hex: "#10b981", ghost: "rgba(16, 185, 129, 0.12)" },
  { id: "violet", name: "Violet", hex: "#8b5cf6", ghost: "rgba(139, 92, 246, 0.12)" },
  { id: "amber", name: "Amber", hex: "#f59e0b", ghost: "rgba(245, 158, 11, 0.12)" },
]

function applyDocumentTheme(theme, accentId) {
  const root = document.documentElement

  // Toggle Dark Class
  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }

  // Set CSS Variables for Primary Accent Color
  const accent = ACCENT_COLORS.find((c) => c.id === accentId) || ACCENT_COLORS[0]
  root.style.setProperty("--teal", accent.hex)
  root.style.setProperty("--teal-ghost", accent.ghost)
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      accent: "teal",

      toggleTheme: () => {
        const nextTheme = get().theme === "dark" ? "light" : "dark"
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

export function useTheme() {
  const theme = useThemeStore((state) => state.theme)
  const accent = useThemeStore((state) => state.accent)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const setAccent = useThemeStore((state) => state.setAccent)

  return { theme, accent, toggleTheme, setTheme, setAccent }
}