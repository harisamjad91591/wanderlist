import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-[9px] border border-card-border bg-surface-soft hover:bg-teal-ghost text-ink dark:text-white dark:bg-card-border transition-colors cursor-pointer flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="size-4 text-ink" />
      ) : (
        <Sun className="size-4 text-amber-400" />
      )}
    </button>
  )
}

export default ThemeToggle