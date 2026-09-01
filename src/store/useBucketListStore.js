import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useBucketListStore = create(
  // `persist` middleware automatic LocalStorage handle karta hai (no manual useEffect needed)
  persist(
    (set, get) => ({
      // --- STATE ---
      bucketList: [],
      history: [],
      searchQuery: "",
      sortBy: "default",

      // --- ACTIONS / SETTERS ---
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),

      // Activity History Log Add karna
      addHistoryLog: (type, countryName, details) => {
        if (!countryName) return
        const newEntry = {
          id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 7),
          type,
          countryName,
          details,
          timestamp: new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        }
        // Zustand `set` method: previous state le kar new history return karta hai
        set((state) => ({ history: [newEntry, ...state.history] }))
      },

      // Country Add / Budget Update karna
      addCountry: (country, amount) => {
        if (!country || !country.code) return
        const { bucketList, addHistoryLog } = get() // `get()` se current state access hoti hai
        const existingItem = bucketList.find((item) => item.code === country.code)

        if (!existingItem) {
          addHistoryLog("ADD", country.name, `Added to Bucket List with budget ${amount || 0} PKR`)
          set((state) => ({
            bucketList: [...state.bucketList, { ...country, amount: amount || "0", note: "" }],
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
              item.code === country.code ? { ...item, ...country, amount: newAmount } : item
            ),
          }))
        }
      },

      // Travel Notes update karna
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

      // Country Remove karna
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

      // Clear All Saved Places
      clearBucketList: () => {
        const { bucketList, addHistoryLog } = get()
        if (bucketList.length > 0) {
          addHistoryLog("REMOVE", "All Saved Places", "Cleared all countries from Bucket List")
        }
        set({ bucketList: [] })
      },

      // Clear History Log
      clearHistory: () => set({ history: [] }),

      // Helper: Check if country is saved
      isCountrySaved: (code) => {
        if (!code) return false
        return get().bucketList.some((item) => item.code === code)
      },
    }),
    {
      name: "wanderlist:bucket-list-zustand", // LocalStorage Key Name
      partialize: (state) => ({ bucketList: state.bucketList, history: state.history }),
    }
  )
)

// Helper Custom Hook: Taakay components mein same pehle jaisa `useBucketList()` interface mile
export function useBucketList() {
  const store = useBucketListStore()

  // Dynamic Filtering + Sorting Logic
  const queryLower = store.searchQuery.trim().toLowerCase()
  let processedList = store.bucketList.filter((country) => {
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

  // Total Budget (PKR) Calculation
  const totalBudgetPKR = store.bucketList.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return {
    ...store,
    filteredBucketList: processedList,
    displayCount: processedList.length,
    totalBudgetPKR,
  }
}