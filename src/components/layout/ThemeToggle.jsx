import { Check, Moon, Palette, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ACCENT_COLORS, useTheme } from "@/store/useThemeStore"

function ThemeToggle() {
  const { theme, accent, setTheme, setAccent } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-card-border dark:border-slate-700 dark:bg-slate-800 text-ink dark:text-white hover:bg-surface-soft dark:hover:bg-slate-700 transition-all shadow-2xs"
          aria-label="Theme Customizer"
        >
          <Palette className="size-4 text-teal" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 p-4 rounded-2xl bg-white dark:bg-slate-800 border-card-border dark:border-slate-700 shadow-xl space-y-4"
      >
        {/* Mode Selector (Light vs Dark) */}
        <div>
          <label className="font-mono text-[10.5px] uppercase tracking-wider text-muted-5 dark:text-slate-400 block mb-2">
            Appearance
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                theme === "light"
                  ? "bg-white dark:bg-slate-800 text-ink dark:text-white shadow-2xs"
                  : "text-muted-2 dark:text-slate-400 hover:text-ink"
              }`}
            >
              <Sun className="size-3.5 text-amber-500" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                theme === "dark"
                  ? "bg-white dark:bg-slate-800 text-ink dark:text-white shadow-2xs"
                  : "text-muted-2 dark:text-slate-400 hover:text-white"
              }`}
            >
              <Moon className="size-3.5 text-indigo-400" />
              Dark
            </button>
          </div>
        </div>

        {/* Accent Color Picker */}
        <div>
          <label className="font-mono text-[10.5px] uppercase tracking-wider text-muted-5 dark:text-slate-400 block mb-2">
            Primary Color Theme
          </label>
          <div className="grid grid-cols-6 gap-2">
            {ACCENT_COLORS.map((color) => {
              const isSelected = accent === color.id
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setAccent(color.id)}
                  title={color.name}
                  style={{ backgroundColor: color.hex }}
                  className={`size-7 rounded-full flex items-center justify-center transition-transform cursor-pointer border-none shadow-2xs ${
                    isSelected ? "scale-110 ring-2 ring-offset-2 ring-teal" : "hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                >
                  {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ThemeToggle