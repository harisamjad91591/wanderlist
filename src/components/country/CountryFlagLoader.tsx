import { Globe } from "lucide-react"

/**
 * Props contract for the dynamic country flag loader component.
 */
export interface CountryFlagLoaderProps {
  flagUrl?: string | null
  countryName?: string | null
  message?: string
}

/**
 * Animated loader component displaying dynamic country flags with glowing pulses and backdrop blur.
 */
export default function CountryFlagLoader({
  flagUrl,
  countryName,
  message = "Fetching real-time data & rates…",
}: CountryFlagLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-5 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 rounded-full bg-teal/20 dark:bg-teal-500/20 animate-ping" />
        <div className="absolute size-28 rounded-full border-2 border-dashed border-teal/40 dark:border-teal-400/40 animate-[spin_8s_linear_infinite]" />

        <div className="relative z-10 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-card-border dark:border-slate-700 animate-bounce duration-1000">
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={countryName || "Country flag"}
              className="w-20 h-14 object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="w-20 h-14 bg-teal/10 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Globe className="size-8 text-teal animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-display font-bold text-lg text-ink dark:text-white m-0 tracking-tight">
          {countryName ? `Exploring ${countryName}…` : "Loading Country…"}
        </h3>
        <p className="font-mono text-xs text-muted-2 dark:text-slate-400 m-0">
          {message}
        </p>
      </div>
    </div>
  )
}