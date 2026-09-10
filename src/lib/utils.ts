import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges conditional CSS class names using `clsx` and resolves Tailwind conflicts via `twMerge`.
 * 
 * @param inputs - Array of class names, objects, or expressions
 * @returns Consolidated Tailwind CSS class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Constructs flag image graphic URL from standard 2-letter ISO country code.
 * 
 * @param countryCode - 2-letter ISO country code
 * @returns Asset URL hosted on FlagCDN
 */
export function getFlagUrl(countryCode: string): string {
  if (!countryCode) return ""
  return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`
}

/**
 * Resolves localized currency symbol (e.g. "USD" -> "$") using standard browser Intl API.
 * 
 * @param currencyCode - ISO 4217 currency code string
 * @returns Extracted currency symbol or original code as fallback
 */
export function getCurrencySymbol(currencyCode?: string | null): string {
  if (!currencyCode) return ""
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).formatToParts(0)
    return parts.find((part) => part.type === "currency")?.value ?? currencyCode
  } catch {
    return currencyCode
  }
}