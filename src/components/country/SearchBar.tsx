import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { searchCountries } from "@/lib/api"
import { getFlagUrl } from "@/lib/utils"

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search a country…  (try Japan)",
}) {
  const [suggestions, setSuggestions] = useState([])
  const [suggestStatus, setSuggestStatus] = useState("idle")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const lastQueryRef = useRef("")

  const handleInputChange = (e) => {
    const val = e.target.value
    onChange(val)
    setHighlightedIndex(-1)
    if (!val.trim()) {
      setIsOpen(false)
      setSuggestions([])
    }
  }

  useEffect(() => {
    const query = value.trim()
    if (!query) return

    let cancelled = false
    const timeoutId = setTimeout(() => {
      if (query === lastQueryRef.current) return
      lastQueryRef.current = query
      setSuggestStatus("loading")

      searchCountries(query)
        .then((countries) => {
          if (cancelled) return
          setSuggestions(countries ? countries.slice(0, 8) : [])
          setSuggestStatus("idle")
          setIsOpen(true)
          setHighlightedIndex(-1)
        })
        .catch(() => {
          if (cancelled) return
          setSuggestions([])
          setSuggestStatus("error")
          setIsOpen(true)
          setHighlightedIndex(-1)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [value])

  const queryLower = value.trim().toLowerCase()
  const filteredSuggestions = suggestions.filter((c) =>
    c.name.toLowerCase().includes(queryLower)
  )

  function commitSearch(query) {
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSearch(query)
  }

  function handleSelect(country) {
    onChange(country.name)
    commitSearch(country.name)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (showDropdown && highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
      handleSelect(filteredSuggestions[highlightedIndex])
    } else {
      commitSearch(value.trim())
    }
  }

  function handleKeyDown(event) {
    if (!showDropdown || filteredSuggestions.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlightedIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      )
    } else if (event.key === "Escape") {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  const showDropdown = isOpen && value.trim() !== ""

  return (
    <Popover open={showDropdown} onOpenChange={setIsOpen}>
      <form onSubmit={handleSubmit} className="flex gap-[10px] w-full">
        <PopoverAnchor className="relative flex-1">
          <Input
            className="search-input w-full"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => value.trim() !== "" && suggestions.length > 0 && setIsOpen(true)}
            autoComplete="off"
          />
        </PopoverAnchor>

        <Button type="submit" variant="primary" className="h-auto">
          Search
        </Button>
      </form>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 border border-card-border overflow-hidden bg-white rounded-[14px] shadow-[0_14px_34px_rgba(20,45,55,0.14)]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px] py-1.5 px-1">
            {suggestStatus === "loading" && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-muted-1">
                <Loader2 className="size-4 animate-spin text-teal" />
                Searching…
              </div>
            )}

            {suggestStatus === "error" && (
              <div className="px-4 py-3 text-sm font-mono text-remove-text-hover">
                Couldn&rsquo;t reach the countries API.
              </div>
            )}

            {suggestStatus === "idle" && filteredSuggestions.length === 0 && (
              <CommandEmpty className="px-4 py-3 text-sm font-mono text-muted-1">
                No countries found.
              </CommandEmpty>
            )}

            {suggestStatus === "idle" && filteredSuggestions.length > 0 && (
              <CommandGroup>
                {filteredSuggestions.map((country, index) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => handleSelect(country)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center gap-3 px-3 py-2 mx-1.5 rounded-[9px] cursor-pointer transition-colors text-ink ${
                      index === highlightedIndex
                        ? "bg-surface-soft font-semibold"
                        : "hover:bg-surface-soft"
                    }`}
                  >
                    <img
                      src={getFlagUrl(country.code)}
                      alt=""
                      className="w-7 h-5 object-cover rounded-[4px] bg-[#ede8de] shrink-0"
                    />
                    <span className="text-[14.5px] truncate">
                      {country.name}
                    </span>
                    {country.capital && (
                      <span className="ml-auto text-xs font-mono text-muted-5 truncate">
                        {country.capital}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchBar