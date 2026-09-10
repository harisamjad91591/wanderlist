const COUNTRIES_API_URL = "https://api.restcountries.com/countries/v5"
const RATES_API_URL = "https://api.frankfurter.dev/v2"

// Hardcoded API Key for practice
const COUNTRIES_API_KEY = "rc_live_075f423d21cc46098a8be3098beced10"

const RESPONSE_FIELDS =
  "names.common,codes.alpha_2,capitals,currencies,calling_codes,continents,languages"

async function countriesRequest(path, params = {}) {
  const url = new URL(`${COUNTRIES_API_URL}${path}`)
  url.searchParams.set("response_fields", RESPONSE_FIELDS)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value)
    }
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${COUNTRIES_API_KEY}` },
  })

  const json = await res.json()

  if (!res.ok) {
    console.error("Countries API error:", res.status, json)
    throw new Error(json.errors?.[0]?.message ?? `Countries API error (${res.status})`)
  }

  return json.data
}

function normalizeCountry(raw) {
  const currency = getCurrencyCode(raw.currencies)

  return {
    code: raw.codes?.alpha_2 ?? null,
    name: raw.names?.common ?? "",
    capital: raw.capitals?.[0]?.name ?? null,
    currency,
    phone: raw.calling_codes?.[0] ?? null,
    continent: raw.continents?.[0] ? { name: raw.continents[0] } : null,
    languages: Array.isArray(raw.languages)
      ? raw.languages.map((lang) => ({
          name: lang.name ?? lang.english_name ?? lang.common ?? "",
        }))
      : [],
  }
}

function getCurrencyCode(currencies) {
  if (!currencies) return null

  if (Array.isArray(currencies)) {
    const first = currencies[0]
    if (!first) return null
    return typeof first === "string" ? first : first.code ?? first.iso_code ?? null
  }

  const keys = Object.keys(currencies)
  return keys[0] ?? null
}

export async function searchCountries(query) {
  const q = query.trim()
  if (!q) return []

  const data = await countriesRequest("/name", { q, limit: 20 })
  return (data.objects ?? []).map(normalizeCountry)
}

export async function getCountryByCode(code) {
  const data = await countriesRequest(`/codes.alpha_2/${code}`)
  const raw = data.objects?.[0]
  return raw ? normalizeCountry(raw) : null
}

export async function convertCurrency({ amount, from, to }) {
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

  const data = await res.json()

  if (typeof data.rate !== "number") {
    throw new Error(`Conversion unavailable for ${base} → ${target}`)
  }

  return {
    rate: data.rate,
    result: numericAmount * data.rate,
    date: data.date ?? null,
  }
}