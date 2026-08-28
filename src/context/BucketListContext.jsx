import { createContext, useContext, useEffect, useState } from "react"

const BucketListContext = createContext(null)

const STORAGE_KEY = "wanderlist:bucket-list"

function readInitialList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function BucketListProvider({ children }) {
  const [bucketList, setBucketList] = useState(readInitialList)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bucketList))
  }, [bucketList])

  function addCountry(country, amount) {
    setBucketList((currentList) => {
      const existingIndex = currentList.findIndex(
        (item) => item.code === country.code
      )

      if (existingIndex === -1) {
        return [...currentList, { ...country, amount }]
      }

      const updatedList = [...currentList]
      const existing = updatedList[existingIndex]
      updatedList[existingIndex] = {
        ...existing,
        ...country,
        amount: amount !== undefined ? amount : existing.amount,
      }
      return updatedList
    })
  }

  function removeCountry(code) {
    setBucketList((currentList) =>
      currentList.filter((item) => item.code !== code)
    )
  }

  function isCountrySaved(code) {
    return bucketList.some((item) => item.code === code)
  }

  // Live Filtered List: Filter query ke mutabiq items filter hote hain
  const queryLower = searchQuery.trim().toLowerCase()
  const filteredBucketList = bucketList.filter((country) => {
    if (!queryLower) return true
    return country.name?.toLowerCase().startsWith(queryLower)
  })

  // Dynamic Count: Jab search query hogi to filtered count (e.g. 3) show hoga, warna total (e.g. 10)
  const displayCount = filteredBucketList.length

  const value = {
    bucketList,
    filteredBucketList,
    searchQuery,
    setSearchQuery,
    displayCount,
    addCountry,
    removeCountry,
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