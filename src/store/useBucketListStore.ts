import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BucketListItem, Country, HistoryLog, HistoryType, SortOption } from "@/types"

/**
 * State properties stored in Zustand bucket list store.
 */
export interface BucketListState {
  bucketList: BucketListItem[]
  history: HistoryLog[]
  searchQuery: string
  sortBy: SortOption
}

/**
 * Action signatures and store manipulators.
 */
export interface BucketListActions {
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: SortOption) => void
  addHistoryLog: (type: HistoryType, countryName: string, details: string) => void
  addCountry: (country: Country, amount?: string) => void
  updateCountryNote: (code: string, note: string) => void
  removeCountry: (code: string) => void
  clearBucketList: () => void
  clearHistory: () => void
  isCountrySaved: (code: string) => boolean
}

export type BucketListStore = BucketListState & BucketListActions

/**
 * Global Zustand store managing bucket list entities, persistence, and audit logging.
 */
export const useBucketListStore = create<BucketListStore>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      bucketList: [],
      history: [],
      searchQuery: "",
      sortBy: "default",

      // --- ACTIONS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),

      /**
       * Appends a structured audit entry to activity history.
       */
      addHistoryLog: (type, countryName, details) => {
        if (!countryName) return
        const newEntry: HistoryLog = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type,
          countryName,
          details,
          timestamp: new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        }
        set((state) => ({ history: [newEntry, ...state.history] }))
      },

      /**
       * Inserts a country or modifies budget allocation with automatic audit logging.
       */
      addCountry: (country, amount) => {
        if (!country || !country.code) return
        const { bucketList, addHistoryLog } = get()
        const existingItem = bucketList.find((item) => item.code === country.code)

        if (!existingItem) {
          addHistoryLog("ADD", country.name, `Added to Bucket List with budget ${amount || "0"} PKR`)
          set((state) => ({
            bucketList: [
              ...state.bucketList,
              { ...country, amount: amount || "0", note: "" },
            ],
          }))
        } else {
          const oldAmount = existingItem.amount || "0"
          const newAmount = amount !== undefined ? amount : oldAmount

          if (String(oldAmount) !== String(newAmount)) {
            addHistoryLog(
              "UPDATE",
              country.name,
              `Updated budget from ${oldAmount} PKR to ${newAmount} PKR`
            )
          }

          set((state) => ({
            bucketList: state.bucketList.map((item) =>
              item.code === country.code
                ? { ...item, ...country, amount: newAmount }
                : item
            ),
          }))
        }
      },

      /**
       * Updates custom notes attached to a saved country.
       */
      updateCountryNote: (code, note) => {
        if (!code) return
        const { bucketList, addHistoryLog } = get()
        const existingItem = bucketList.find((item) => item.code === code)

        if (existingItem && existingItem.note !== note) {
          addHistoryLog("NOTE", existingItem.name, `Updated travel notes: "${note}"`)
          set((state) => ({
            bucketList: state.bucketList.map((item) =>
              item.code === code ? { ...item, note } : item
            ),
          }))
        }
      },

      /**
       * Evicts a country from state by ISO code.
       */
      removeCountry: (code) => {
        if (!code) return
        const { bucketList, addHistoryLog } = get()
        const itemToRemove = bucketList.find((item) => item.code === code)
        if (itemToRemove) {
          addHistoryLog("REMOVE", itemToRemove.name, "Removed from Bucket List")
        }
        set((state) => ({
          bucketList: state.bucketList.filter((item) => item.code !== code),
        }))
      },

      /**
       * Empties saved list with audit notification.
       */
      clearBucketList: () => {
        const { bucketList, addHistoryLog } = get()
        if (bucketList.length > 0) {
          addHistoryLog("REMOVE", "All Saved Places", "Cleared all countries from Bucket List")
        }
        set({ bucketList: [] })
      },

      /**
       * Clears history logs.
       */
      clearHistory: () => set({ history: [] }),

      /**
       * Evaluates saved status by code.
       */
      isCountrySaved: (code) => {
        if (!code) return false
        return get().bucketList.some((item) => item.code === code)
      },
    }),
    {
      name: "wanderlist:bucket-list-zustand",
      partialize: (state) => ({ bucketList: state.bucketList, history: state.history }),
    }
  )
)

/**
 * Higher-order custom selector hook providing derived filtering, sorting, and aggregate calculations.
 */
export function useBucketList() {
  const store = useBucketListStore()

  const queryLower = store.searchQuery.trim().toLowerCase()
  let processedList: BucketListItem[] = store.bucketList.filter((country) => {
    if (!queryLower) return true
    return country?.name?.toLowerCase().startsWith(queryLower)
  })

  if (store.sortBy === "name-asc") {
    processedList = [...processedList].sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  } else if (store.sortBy === "name-desc") {
    processedList = [...processedList].sort((a, b) => (b.name || "").localeCompare(a.name || ""))
  } else if (store.sortBy === "budget-high") {
    processedList = [...processedList].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
  } else if (store.sortBy === "budget-low") {
    processedList = [...processedList].sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0))
  }

  const totalBudgetPKR = store.bucketList.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  return {
    ...store,
    filteredBucketList: processedList,
    displayCount: processedList.length,
    totalBudgetPKR,
  }
}