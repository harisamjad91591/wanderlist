import { useEffect } from "react"
import { Search } from "lucide-react"
import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import CountryCard from "@/components/country/CountryCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useBucketList } from "@/context/BucketListContext"

function MyListPage() {
  const {
    bucketList,
    filteredBucketList,
    searchQuery,
    setSearchQuery,
    displayCount,
    addCountry,
    removeCountry,
  } = useBucketList()

  // Page unmount hone par search reset ho jaye ga
  useEffect(() => {
    return () => setSearchQuery("")
  }, [setSearchQuery])

  function handleUpdate(country, amount) {
    addCountry(country, amount)
    toast.info(`${country.name}'s amount updated`)
  }

  function handleRemove(country) {
    removeCountry(country.code)
    toast.info(`${country.name} removed from your list`)
  }

  return (
    <div className="min-h-screen bg-panel">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <div className="flex items-center justify-between gap-3 mt-5 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-semibold text-[26px] tracking-[-0.01em] m-0">
              My Bucket List
            </h2>
            {/* Directly displays exact active count (e.g. 3) */}
            <Badge size="md">{displayCount} places</Badge>
          </div>
        </div>

        {bucketList.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Filter my saved places (e.g. A)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 bg-white border border-card-border rounded-xl"
            />
          </div>
        )}

        {bucketList.length === 0 ? (
          <p className="text-muted-1 text-sm">
            Nothing here yet — search for a country and add it to your list.
          </p>
        ) : filteredBucketList.length === 0 ? (
          <p className="text-muted-1 text-sm">
            No saved places starting with &ldquo;{searchQuery}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBucketList.map((country) => (
              <CountryCard
                key={country.code}
                country={country}
                mode="remove"
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListPage