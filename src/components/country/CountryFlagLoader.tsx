import { Globe } from "lucide-react"

/**
 * Props contract for the CountryFlagLoader component.
 */
export interface CountryFlagLoaderProps {
  flagUrl?: string | null
  countryName?: string | null
  message?: string
}

/**
 * Minimalist centered spinner with optional embedded flag preview.
 */
export default function CountryFlagLoader({
  flagUrl,
  countryName,
  message = "Loading details…",
}: CountryFlagLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[260px] py-10 space-y-3.5">
      {/* Centered Rotating Spinner with Mini Flag */}
      <div className="relative flex items-center justify-center size-12">
        {/* Rotating Outer Spinner Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-teal/20 dark:border-teal-500/20 border-t-teal dark:border-t-teal-400 animate-spin" />

        {/* Small Center Flag Graphic */}
        <div className="z-10 flex items-center justify-center">
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={countryName || "Country flag"}
              className="w-6 h-4 object-cover rounded-[3px] shadow-2xs"
            />
          ) : (
            <Globe className="size-4 text-teal" />
          )}
        </div>
      </div>

      {/* Clean Text Label */}
      <div className="text-center space-y-0.5">
        <p className="font-display font-medium text-sm text-ink dark:text-white m-0">
          {countryName ? `Loading ${countryName}` : "Loading country"}
        </p>
        <p className="font-mono text-[11px] text-muted-2 dark:text-slate-400 m-0">
          {message}
        </p>
      </div>
    </div>
  )
}