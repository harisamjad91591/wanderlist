import { createContext, useContext, useEffect, useState } from "react"

// Shared "my list" state — this is the one thing multiple pages need
// at once (Navbar's count, SearchPage's add button, MyListPage's
// remove button), so it lives in Context instead of one page's state.
//
// `code` is each country's unique id in our mock data. Once the real
// Countries API is wired up (see lib/api.js), swap it for whatever
// unique field that API returns (e.g. the ISO cca3 code).

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

  // Keep localStorage in sync whenever the list changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bucketList))
  }, [bucketList])

  function addCountry(country) {
    setBucketList((currentList) => {
      const alreadyExists = currentList.some(
        (item) => item.code === country.code
      )
      if (alreadyExists) return currentList
      return [...currentList, country]
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

  const value = { bucketList, addCountry, removeCountry, isCountrySaved }

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
