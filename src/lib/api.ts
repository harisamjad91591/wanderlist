import type { Country } from "@/types"

const COUNTRIES_API_URL = "https://api.restcountries.com/countries/v5"
const RATES_API_URL = "https://api.frankfurter.dev/v2"

// Hardcoded API Key for practice
const COUNTRIES_API_KEY = "rc_live_075f423d21cc46098a8be3098beced10"

const RESPONSE_FIELDS =
  "names.common,codes.alpha_2,capitals,currencies,calling_codes,continents,languages"

/**
 * Raw internal language payload returned by the external Rest Countries API.
 */
interface RawLanguage {
  name?: string
  english_name?: string
  common?: string
}

/**
 * Flexible structural representation of unnormalized country response objects.
 */
interface RawCountry {
  codes?: { alpha_2?: string }
  names?: { common?: string }
  capitals?: Array<{ name?: string }>
  currencies?: Record<string, { code?: string; iso_code?: string } | string> | Array<string | { code?: string; iso_code?: string }>
  calling_codes?: string[]
  continents?: string[]
  languages?: RawLanguage[]
}

/**
 * API response container contract.
 */
interface RawApiResponse {
  data?: {
    objects?: RawCountry[]
  }
  errors?: Array<{ message?: string }>
}

/**
 * Currency conversion input parameters contract.
 */
export interface ConvertParams {
  amount: string | number
  from?: string
  to?: string
}

/**
 * Return contract for currency exchange computations.
 */
export interface ConversionResult {
  rate: number
  result: number
  date: string | null
}

/**
 * Generic HTTP request wrapper around Rest Countries API endpoint.
 * 
 * @param path - API endpoint route path
 * @param params - Optional key-value record for query parameters
 * @returns Promise resolving raw API response container
 */
async function countriesRequest(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {}
): Promise<RawApiResponse["data"]> {
  const url = new URL(`${COUNTRIES_API_URL}${path}`)
  url.searchParams.set("response_fields", RESPONSE_FIELDS)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${COUNTRIES_API_KEY}` },
  })

  const json: RawApiResponse = await res.json()

  if (!res.ok) {
    console.error("Countries API error:", res.status, json)
    throw new Error(json.errors?.[0]?.message ?? `Countries API error (${res.status})`)
  }

  return json.data
}

/**
 * Resolves currency ISO code string across dynamic payload shapes (Arrays vs Record objects).
 */
function getCurrencyCode(currencies: RawCountry["currencies"]): string | undefined {
  if (!currencies) return undefined

  if (Array.isArray(currencies)) {
    const first = currencies[0]
    if (!first) return undefined
    return typeof first === "string" ? first : first.code ?? first.iso_code
  }

  const keys = Object.keys(currencies)
  const firstKey = keys[0]
  return firstKey
}

/**
 * Normalizes raw external API payload into a strict application domain `Country` contract.
 */
function normalizeCountry(raw: RawCountry): Country {
  const currency = getCurrencyCode(raw.currencies)

  return {
    code: raw.codes?.alpha_2 ?? "",
    name: raw.names?.common ?? "",
    capital: raw.capitals?.[0]?.name,
    currency,
    phone: raw.calling_codes?.[0],
    continent: raw.continents?.[0] ? { name: raw.continents[0] } : undefined,
    languages: Array.isArray(raw.languages)
      ? raw.languages.map((lang) => ({
          name: lang.name ?? lang.english_name ?? lang.common ?? "",
        }))
      : [],
  }
}

/**
 * Searches countries matching input query string.
 */
export async function searchCountries(query: string): Promise<Country[]> {
  const q = query.trim()
  if (!q) return []

  const data = await countriesRequest("/name", { q, limit: 20 })
  return (data?.objects ?? []).map(normalizeCountry)
}

/**
 * Fetches single country details by ISO alpha-2 code.
 */
export async function getCountryByCode(code: string): Promise<Country | null> {
  if (!code) return null
  const data = await countriesRequest(`/codes.alpha_2/${code}`)
  const raw = data?.objects?.[0]
  return raw ? normalizeCountry(raw) : null
}

/**
 * Fetches fiat exchange rate and computes converted amount using Frankfurter API.
 */
export async function convertCurrency({
  amount,
  from,
  to,
}: ConvertParams): Promise<ConversionResult> {
  const numericAmount = Number(amount)

  if (!from || !to || from === to) {
    return {
      rate: 1,
      result: numericAmount,
      date: null,
    }
  }

  const base = from.toUpperCase()
  const target = to.toUpperCase()

  const res = await fetch(`${RATES_API_URL}/rate/${base}/${target}`, {
    method: "GET",
  })

  if (!res.ok) {
    throw new Error(`Conversion unavailable for ${base} → ${target}`)
  }

  const data: { rate?: number; date?: string } = await res.json()

  if (typeof data.rate !== "number") {
    throw new Error(`Conversion unavailable for ${base} → ${target}`)
  }

  return {
    rate: data.rate,
    result: numericAmount * data.rate,
    date: data.date ?? null,
  }
}