import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * <SearchBar />
 * A controlled component — it owns no state of its own. SearchPage
 * passes the current value + a setter, and gets told when to search.
 *
 *   <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
 */
function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search a country…  (try Japan)",
}) {
  function handleSubmit(event) {
    event.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-[10px]">
      <Input
        className="search-input flex-1"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button type="submit" variant="primary" className="h-auto">
        Search
      </Button>
    </form>
  )
}

export default SearchBar
