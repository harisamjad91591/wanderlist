import { useEffect, useRef, useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { searchCountries } from "@/lib/api"
import { getFlagUrl } from "@/lib/utils"

const POPULAR_DESTINATIONS = [
  { name: "Japan", code: "JP" },
  { name: "Turkey", code: "TR" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Switzerland", code: "CH" },
]

function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [status, setStatus] = useState("idle")

  const navigate = useNavigate()
  const inputRef = useRef(null)

  function handleSearchChange(e) {
    const value = e.target.value
    setQuery(value)

    // Clear state directly in event handler instead of useEffect
    if (!value.trim()) {
      setResults([])
      setStatus("idle")
      setSelectedIndex(-1)
    }
  }

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    setStatus("loading")
    const timeoutId = setTimeout(() => {
      searchCountries(trimmed)
        .then((data) => {
          setResults(data || [])
          setStatus("idle")
          setSelectedIndex(-1)
        })
        .catch(() => {
          setResults([])
          setStatus("error")
        })
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [query])

  function handleSelectCountry(code) {
    setQuery("")
    setResults([])
    navigate(`/country/${code}`)
  }

  function handleKeyDown(e) {
    if (results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectCountry(results[selectedIndex].code)
    } else if (e.key === "Escape") {
      setResults([])
      setSelectedIndex(-1)
    }
  }

  return (
    <div className="min-h-screen bg-panel dark:bg-slate-900 transition-colors">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <div className="mt-8 mb-6 space-y-2">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink dark:text-white tracking-tight m-0">
            Explore & Convert
          </h1>
          <p className="text-muted-1 dark:text-slate-400 text-base m-0">
            Find any country to check real-time exchange rates and build your travel list.
          </p>
        </div>

        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-2 pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Where to next? Search a country…"
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 py-6 text-base bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal/30 dark:text-white transition-all"
            />
          </div>

          {query.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-30 animate-in fade-in-50 duration-150">
              {status === "loading" ? (
                <div className="p-4 text-center font-mono text-sm text-muted-2 dark:text-slate-400">
                  Searching places…
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-[320px] overflow-y-auto py-2">
                  {results.map((country, idx) => (
                    <div
                      key={country.code}
                      onClick={() => handleSelectCountry(country.code)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                        idx === selectedIndex
                          ? "bg-teal-ghost dark:bg-slate-700/70 text-teal dark:text-teal-300"
                          : "hover:bg-panel dark:hover:bg-slate-700/40 text-ink dark:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getFlagUrl(country.code)}
                          alt={country.name}
                          className="w-7 h-5 object-cover rounded shadow-sm"
                        />
                        <span className="font-medium text-sm">{country.name}</span>
                      </div>
                      {country.currency && (
                        <Badge size="sm" className="font-mono text-xs">
                          {country.currency}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : status === "error" ? (
                <div className="p-4 text-center text-sm text-rose-500">
                  Failed to fetch countries. Please try again.
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-2 dark:text-slate-400">
                  No countries found matching &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {query.trim() === "" && (
          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-5 dark:text-slate-400">
              <Sparkles className="size-3.5 text-terracotta" />
              Popular Destinations
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelectCountry(item.code)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 text-xs font-semibold text-ink dark:text-white hover:border-teal dark:hover:border-teal transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                >
                  <img
                    src={getFlagUrl(item.code)}
                    alt={item.name}
                    className="w-4 h-3 object-cover rounded-sm"
                  />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage