import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import CountryCard from "@/components/country/CountryCard"
import { Badge } from "@/components/ui/badge"
import { useBucketList } from "@/context/BucketListContext"

function MyListPage() {
  const { bucketList, removeCountry } = useBucketList()

  function handleRemove(country) {
    removeCountry(country.code)
    toast.info(`${country.name} removed from your list`)
  }

  return (
    <div className="min-h-screen bg-panel">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <div className="flex items-center gap-3 mt-5 mb-5">
          <h2 className="font-display font-semibold text-[26px] tracking-[-0.01em] m-0">
            My Bucket List
          </h2>
          <Badge size="md">{bucketList.length} places</Badge>
        </div>

        {bucketList.length === 0 ? (
          <p className="text-muted-1 text-sm">
            Nothing here yet — search for a country and add it to your list.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bucketList.map((country) => (
              <CountryCard
                key={country.code}
                country={country}
                mode="remove"
                onAction={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListPage
