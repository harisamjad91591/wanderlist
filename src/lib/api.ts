import type { Country } from "@/types"
import { z } from "zod"

const COUNTRIES_API_URL = "https://api.restcountries.com/countries/v5"
const RATES_API_URL = "https://api.frankfurter.dev/v2"

const COUNTRIES_API_KEY = "rc_live_075f423d21cc46098a8be3098beced10"

const RESPONSE_FIELDS =
  "names.common,codes.alpha_2,capitals,currencies,calling_codes,continents,languages"

const RawLanguageSchema = z.object({
  name: z.string().optional(),
  english_name: z.string().optional(),
  common: z.string().optional(),
})

const CurrencySchema = z.union([
  z.string(),
  z.object({ code: z.string().optional(), iso_code: z.string().optional() }),
])

/**
 * Runtime schema for the flexible, unnormalized country payload returned by the API.
 * TypeScript interfaces alone cannot protect the app from malformed JSON at runtime.
 */
const RawCountrySchema = z.object({
  codes: z.object({ alpha_2: z.string().optional() }).optional(),
  names: z.object({ common: z.string().optional() }).optional(),
  capitals: z.array(z.object({ name: z.string().optional() })).optional(),
  currencies: z.union([z.record(z.string(), CurrencySchema), z.array(CurrencySchema)]).optional(),
  calling_codes: z.array(z.string()).optional(),
  continents: z.array(z.string()).optional(),
  languages: z.array(RawLanguageSchema).optional(),
})

const RawApiResponseSchema = z.object({
  data: z.object({ objects: z.array(RawCountrySchema).optional() }).optional(),
  errors: z.array(z.object({ message: z.string().optional() })).optional(),
})

const ExchangeRateResponseSchema = z.object({
  rate: z.number(),
  date: z.string().optional(),
})

type RawCountry = z.infer<typeof RawCountrySchema>
type RawApiResponse = z.infer<typeof RawApiResponseSchema>

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

  // Validate external JSON before reading nested fields or normalizing it.
  const parsed = RawApiResponseSchema.safeParse(await res.json())
  if (!parsed.success) {
    throw new Error("Invalid countries API response")
  }

  const json: RawApiResponse = parsed.data

  if (!res.ok) {
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

  // Exchange-rate responses are small, so reject the complete payload when its shape changes.
  const parsed = ExchangeRateResponseSchema.safeParse(await res.json())
  if (!parsed.success) {
    throw new Error(`Conversion unavailable for ${base} → ${target}`)
  }

  return {
    rate: parsed.data.rate,
    result: numericAmount * parsed.data.rate,
    date: parsed.data.date ?? null,
  }
}