export const countryKeys = {
  all: ["countries"],
  searches: () => [...countryKeys.all, "search"],
  search: (query) => [...countryKeys.searches(), query],
  details: () => [...countryKeys.all, "detail"],
  detail: (code) => [...countryKeys.details(), code],
  conversions: () => [...countryKeys.all, "conversion"],
  conversion: (from, to, amount) => [...countryKeys.conversions(), from, to, amount],
}