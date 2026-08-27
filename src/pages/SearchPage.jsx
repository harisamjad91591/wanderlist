import { useState } from "react"
import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import SearchBar from "@/components/country/SearchBar"
import CountryCard from "@/components/country/CountryCard"
import { searchCountries } from "@/lib/api"
import { useBucketList } from "@/context/BucketListContext"

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])
  const [status, setStatus] = useState("idle") // idle | loading | error | empty
  const { addCountry } = useBucketList()

  async function handleSearch() {
    const query = searchQuery.trim()
    if (!query) return

    setStatus("loading")
    try {
      const countries = await searchCountries(query)
      setResults(countries)
      setStatus(countries.length === 0 ? "empty" : "idle")
    } catch {
      setStatus("error")
    }
  }

  function handleAdd(country) {
    addCountry(country)
    toast.success(`${country.name} added to your list`)
  }

  return (
    <div className="min-h-screen bg-panel">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <h2 className="font-display font-semibold text-[28px] tracking-[-0.01em] mt-[26px] mb-1">
          Where to <span className="text-teal italic">next?</span>
        </h2>
        <p className="text-muted-1 mb-5 text-[15px]">
          Search a country to see its details and add it to your list.
        </p>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        {status === "loading" && (
          <p className="text-muted-1 text-sm mb-4">Searching…</p>
        )}
        {status === "error" && (
          <p className="text-remove-text-hover text-sm mb-4">
            Something went wrong reaching the countries API. Try again.
          </p>
        )}
        {status === "empty" && (
          <p className="text-muted-1 text-sm mb-4">
            No countries matched &ldquo;{searchQuery}&rdquo;.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((country) => (
            <CountryCard
              key={country.code}
              country={country}
              mode="add"
              onAction={handleAdd}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
