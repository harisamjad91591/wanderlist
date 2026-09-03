import { createContext, useContext, useEffect, useState } from "react"

const BucketListContext = createContext(null)

const STORAGE_KEY = "wanderlist:bucket-list"
const HISTORY_KEY = "wanderlist:history"

function readStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function BucketListProvider({ children }) {
  const [bucketList, setBucketList] = useState(() => readStorage(STORAGE_KEY))
  const [history, setHistory] = useState(() => readStorage(HISTORY_KEY))
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bucketList))
  }, [bucketList])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  function addHistoryLog(type, countryName, details) {
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
    setHistory((prev) => [newEntry, ...prev])
  }

  function addCountry(country, amount) {
    if (!country || !country.code) return

    const existingItem = bucketList.find((item) => item.code === country.code)

    if (!existingItem) {
      addHistoryLog("ADD", country.name, `Added to Bucket List with budget ${amount || 0} PKR`)
      setBucketList((prev) => [...prev, { ...country, amount: amount || "0", note: "" }])
    } else {
      const oldAmount = existingItem.amount || "0"
      const newAmount = amount !== undefined ? amount : oldAmount

      if (String(oldAmount) !== String(newAmount)) {
        addHistoryLog("UPDATE", country.name, `Updated budget from ${oldAmount} PKR to ${newAmount} PKR`)
      }

      setBucketList((prev) =>
        prev.map((item) =>
          item.code === country.code
            ? { ...item, ...country, amount: newAmount }
            : item
        )
      )
    }
  }

  function updateCountryNote(code, note) {
    if (!code) return
    const existingItem = bucketList.find((item) => item.code === code)

    if (existingItem && existingItem.note !== note) {
      addHistoryLog("NOTE", existingItem.name, `Updated travel notes: "${note}"`)
      setBucketList((prev) =>
        prev.map((item) => (item.code === code ? { ...item, note } : item))
      )
    }
  }

  function removeCountry(code) {
    if (!code) return
    const itemToRemove = bucketList.find((item) => item.code === code)
    if (itemToRemove) {
      addHistoryLog("REMOVE", itemToRemove.name, "Removed from Bucket List")
    }
    setBucketList((prev) => prev.filter((item) => item.code !== code))
  }

  function clearBucketList() {
    if (bucketList.length > 0) {
      addHistoryLog("REMOVE", "All Saved Places", "Cleared all countries from Bucket List")
    }
    setBucketList([])
  }

  function clearHistory() {
    setHistory([])
  }

  function isCountrySaved(code) {
    if (!code) return false
    return bucketList.some((item) => item.code === code)
  }

  // Filter countries starting with the typed letter/prefix
  const queryLower = searchQuery.trim().toLowerCase()
  let processedList = bucketList.filter((country) => {
    if (!queryLower) return true
    return country?.name?.trim().toLowerCase().startsWith(queryLower)
  })

  // Sorting logic
  if (sortBy === "name-asc") {
    processedList = [...processedList].sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  } else if (sortBy === "name-desc") {
    processedList = [...processedList].sort((a, b) => (b.name || "").localeCompare(a.name || ""))
  } else if (sortBy === "budget-high") {
    processedList = [...processedList].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
  } else if (sortBy === "budget-low") {
    processedList = [...processedList].sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0))
  }

  // Dynamic budget calculation based on filtered items
  const totalBudgetPKR = processedList.reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const value = {
    bucketList,
    filteredBucketList: processedList,
    history,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    displayCount: processedList.length,
    totalBudgetPKR,
    addCountry,
    updateCountryNote,
    removeCountry,
    clearBucketList,
    clearHistory,
    isCountrySaved,
  }

  return (
    <BucketListContext.Provider value={value}>
      {children}
    </BucketListContext.Provider>
  )
}

export function useBucketList() {
  const context = useContext(BucketListContext)
  if (!context) {
    throw new Error("useBucketList must be used inside a BucketListProvider")
  }
  return context
}