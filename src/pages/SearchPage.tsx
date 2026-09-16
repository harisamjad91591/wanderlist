import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Compass, Globe2, Map, Search, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { searchCountries } from "@/lib/api"
import { getFlagUrl } from "@/lib/utils"
import type { Country } from "@/types"

export type SearchPageStatus = "idle" | "loading" | "error"

export interface PopularDestination {
  name: string
  code: string
}

const POPULAR_DESTINATIONS: PopularDestination[] = [
  { name: "Japan", code: "JP" },
  { name: "Turkey", code: "TR" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Switzerland", code: "CH" },
]

export default function SearchPage() {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<Country[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [status, setStatus] = useState<SearchPageStatus>("idle")

  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)

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

  const handleSelectCountry = (code: string, countryName?: string): void => {
    setQuery("")
    setResults([])
    navigate(`/country/${code}`, {
      state: {
        flagUrl: getFlagUrl(code),
        countryName: countryName || results.find((r) => r.code === code)?.name,
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (results.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selected = results[selectedIndex]
      if (selected) {
        handleSelectCountry(selected.code, selected.name)
      }
    } else if (e.key === "Escape") {
      setResults([])
      setSelectedIndex(-1)
    }
  }

  return (
    <div className="home-shell min-h-screen bg-panel dark:bg-slate-900 transition-colors">
      <div className="home-container max-w-[1180px] mx-auto px-6 py-7 sm:py-9">
        <Navbar />
        <main className="home-main">
          <section className="home-hero">
            <div className="hero-copy">
              <div className="eyebrow"><Compass className="size-4" /> Plan somewhere unforgettable</div>
              <h1 className="font-display text-ink dark:text-white m-0">Your next chapter<br /><em>starts here.</em></h1>
              <p className="hero-description text-muted-1 dark:text-slate-400">Explore the world at your own pace. Compare currencies, save the places that spark something, and turn daydreams into a plan.</p>
            </div>
            <div className="hero-note" aria-label="Wanderlist travel note">
              <div className="hero-note-top"><span>WANDERLIST / 2026</span><Globe2 className="size-4" /></div>
              <div className="hero-note-line" />
              <p>Collect moments,<br /><strong>not just destinations.</strong></p>
              <div className="hero-note-bottom"><span>CURATED BY YOU</span><ArrowUpRight className="size-4" /></div>
            </div>
          </section>

          <section className="search-section" aria-label="Find a destination">
            <div className="section-kicker"><span className="kicker-number">01</span><span>Find your next place</span></div>
            <div className="relative">
              <div className="search-frame">
                <Search className="size-5 text-teal shrink-0" />
                <Input ref={inputRef} type="text" placeholder="Where to next? Search a country…" value={query} onChange={handleSearchChange} onKeyDown={handleKeyDown} className="home-search-input" />
                <span className="search-hint hidden sm:inline-flex">⌘ K</span>
              </div>
              {query.trim() !== "" && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-30 animate-in fade-in-50 duration-150">
                  {status === "loading" ? (
                    <div className="p-4 text-center font-mono text-sm text-muted-2 dark:text-slate-400">Searching places…</div>
                  ) : results.length > 0 ? (
                    <div className="max-h-[320px] overflow-y-auto py-2">
                      {results.map((country, idx) => (
                        <div key={country.code} onClick={() => handleSelectCountry(country.code, country.name)} onMouseEnter={() => setSelectedIndex(idx)} className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${idx === selectedIndex ? "bg-teal-ghost dark:bg-slate-700/70 text-teal dark:text-teal-300" : "hover:bg-panel dark:hover:bg-slate-700/40 text-ink dark:text-white"}`}>
                          <div className="flex items-center gap-3"><img src={getFlagUrl(country.code)} alt={country.name} className="w-7 h-5 object-cover rounded shadow-sm" /><span className="font-medium text-sm">{country.name}</span></div>
                          {country.currency && <Badge size="sm" className="font-mono text-xs">{country.currency}</Badge>}
                        </div>
                      ))}
                    </div>
                  ) : status === "error" ? (
                    <div className="p-4 text-center text-sm text-rose-500">Failed to fetch countries. Please try again.</div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-2 dark:text-slate-400">No countries found matching &ldquo;{query}&rdquo;</div>
                  )}
                </div>
              )}
            </div>
            {query.trim() === "" && (
              <div className="popular-row">
                <div className="popular-heading"><Sparkles className="size-4 text-terracotta" /> Trending now</div>
                <div className="popular-list">
                  {POPULAR_DESTINATIONS.map((item) => <button key={item.code} type="button" onClick={() => handleSelectCountry(item.code, item.name)} className="destination-chip"><img src={getFlagUrl(item.code)} alt={item.name} /><span>{item.name}</span><ArrowUpRight className="size-3.5" /></button>)}
                </div>
              </div>
            )}
          </section>

          <section className="home-footer-grid">
            <div className="footer-intro"><Map className="size-5 text-teal" /><div><strong>Make room for the unexpected.</strong><span>Your personal atlas is waiting.</span></div></div>
            <div className="footer-stat"><span>01</span><strong>Search a country</strong></div>
            <div className="footer-stat"><span>02</span><strong>Save your places</strong></div>
            <div className="footer-stat"><span>03</span><strong>Plan with confidence</strong></div>
          </section>
        </main>
      </div>
    </div>
  )
}