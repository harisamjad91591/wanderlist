import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Builds a flag image URL from a 2-letter country code. No API call
// needed for this — flagcdn serves flags directly by ISO code.
export function getFlagUrl(countryCode) {
  return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`
}

// The countries API gives us a currency CODE ("JPY"), not a symbol
// ("¥"). The browser already knows how to map one to the other, so
// no extra data file or package is needed for this.
export function getCurrencySymbol(currencyCode) {
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
