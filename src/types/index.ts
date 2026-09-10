export type HistoryType = "ADD" | "UPDATE" | "NOTE" | "REMOVE"

export type SortOption =
  | "default"
  | "name-asc"
  | "name-desc"
  | "budget-high"
  | "budget-low"

export interface Country {
  code: string
  name: string
  capital?: string
  currency?: string
  phone?: string
  continent?: {
    name: string
  }
  languages?: Array<{ name: string }>
}

export interface BucketListItem extends Country {
  amount?: string
  note?: string
}

export interface HistoryLog {
  id: string
  type: HistoryType
  countryName: string
  details: string
  timestamp: string
}

export interface ConversionParams {
  fromCurrency: string
  toCurrency: string
  amount: string | number
}