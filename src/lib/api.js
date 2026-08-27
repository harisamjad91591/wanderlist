// APIs used (both free, open source, keyless — checked 27 Aug 2026):
//
// 1. Countries — https://github.com/trevorblades/countries
//    Open-source public GraphQL API for country data. No key, no
//    rate limit. Note: this schema does NOT include population or
//    area, and search is by code/currency/continent only (not by
//    name) — so we fetch the full list once and filter by name
//    ourselves in `searchCountries`.
//
// 2. Frankfurter — https://github.com/lineofflight/frankfurter
//    Open-source (MIT) currency conversion API, no key, no rate
//    limit. v2's /rate/{base}/{quote} returns one flat object:
//    { date, base, quote, rate }.

const COUNTRIES_API_URL = "https://countries.trevorblades.com/graphql"
// const RATES_API_URL = "https://api.frankfurter.dev/v2"
const RATES_API_URL = "https://open.er-api.com/v6/latest"


const COUNTRY_FIELDS = `
  code
  name
  native
  capital
  emoji
  currency
  phone
  continent { name }
  languages { name }
`

async function graphqlRequest(query, variables) {
  const res = await fetch(COUNTRIES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(json.errors[0].message)
  }
  return json.data
}

// The full list is ~250 small records — fetched once, then reused
// for every search so we're not re-downloading it on every keystroke.
let allCountriesCache = null

async function getAllCountries() {
  if (allCountriesCache) return allCountriesCache
  const data = await graphqlRequest(`query { countries { ${COUNTRY_FIELDS} } }`)
  allCountriesCache = data.countries
  return allCountriesCache
}

export async function searchCountries(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const countries = await getAllCountries()
  return countries.filter((country) => country.name.toLowerCase().includes(q))
}

export async function getCountryByCode(code) {
  const data = await graphqlRequest(
    `query GetCountry($code: ID!) { country(code: $code) { ${COUNTRY_FIELDS} } }`,
    { code }
  )
  return data.country
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

  const res = await fetch(`${RATES_API_URL}/${base}`)

  if (!res.ok) {
    throw new Error(`Unable to fetch rates for ${base}`)
  }

  const data = await res.json()

  if (data.result !== "success") {
    throw new Error(`Currency rates unavailable for ${base}`)
  }

  const rate = data.rates?.[target]

  if (typeof rate !== "number") {
    throw new Error(`Conversion unavailable for ${base} → ${target}`)
  }

  return {
    rate,
    result: numericAmount * rate,
    date: data.time_last_update_utc ?? null,
  }
}