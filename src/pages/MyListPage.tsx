import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowUpDown,
  Calculator,
  Download,
  Filter,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import CountryCard from "@/components/country/CountryCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBucketList } from "@/store/useBucketListStore"
import type { Country, SortOption } from "@/types"

/**
 * Page displaying saved bucket list places, aggregate total budget calculations, text export, filtering, and sorting.
 */
export default function MyListPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const {
    bucketList,
    filteredBucketList,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    displayCount,
    totalBudgetPKR,
    addCountry,
    removeCountry,
    clearBucketList,
  } = useBucketList()

  useEffect(() => {
    return () => setSearchQuery("")
  }, [setSearchQuery])

  const handleUpdate = (country: Country, amount: string): void => {
    addCountry(country, amount)
    toast.info(`${country.name}'s budget updated to ${amount || "0"} PKR`)
  }

  const handleRemove = (country: Country): void => {
    removeCountry(country.code)
    toast.info(`${country.name} removed from your list`)
  }

  const handleConfirmClear = (): void => {
    clearBucketList()
    setIsConfirmOpen(false)
    toast.info("All saved places removed from your list")
  }

  const handleExportPlan = (): void => {
    if (bucketList.length === 0) return

    let content = `=======================================\n`
    content += `         WANDERLIST TRAVEL PLAN        \n`
    content += `=======================================\n\n`
    content += `Total Destinations: ${bucketList.length}\n`
    content += `Estimated Total Budget: ${totalBudgetPKR.toLocaleString()} PKR\n\n`
    content += `---------------------------------------\n`

    bucketList.forEach((item, index) => {
      content += `${index + 1}. ${item.name} (${item.code})\n`
      content += `   Capital: ${item.capital || "N/A"}\n`
      content += `   Currency: ${item.currency || "N/A"}\n`
      content += `   Budget: ${Number(item.amount || 0).toLocaleString()} PKR\n`
      if (item.note) {
        content += `   Notes: ${item.note}\n`
      }
      content += `\n`
    })

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Wanderlist_Travel_Plan.txt"
    link.click()
    URL.revokeObjectURL(url)

    toast.success("Travel plan exported successfully!")
  }

  const averageBudget: string =
    bucketList.length > 0 ? (totalBudgetPKR / bucketList.length).toFixed(0) : "0"

  return (
    <div className="min-h-screen bg-page dark:bg-slate-950 transition-colors">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Navbar />

        <div className="relative overflow-hidden mt-5 mb-5 p-4 sm:p-5 rounded-[18px] bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/70 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border border-card-border dark:border-slate-700 shadow-[0_8px_24px_rgba(37,99,235,0.07)]">
          <div className="absolute -right-10 -top-14 size-32 rounded-full border-[14px] border-white/50 dark:border-slate-700/30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="font-display font-semibold text-[25px] sm:text-[28px] leading-none tracking-[-0.02em] m-0 text-ink dark:text-white">
                  My Bucket List
                </h2>
                <Badge size="md" className="bg-teal text-white border-transparent">
                  {displayCount} {displayCount === 1 ? "place" : "places"}
                </Badge>
              </div>
            </div>

          <div className="relative flex items-center gap-2 mt-3 sm:mt-0">
            {bucketList.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPlan}
                  className="text-xs bg-white/80 border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                >
                  <Download className="size-3.5 mr-1 text-teal" />
                  Export Plan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConfirmOpen(true)}
                  className="text-xs text-rose-600 bg-white/70 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-800 dark:hover:bg-rose-950/80"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>
        </div>

        {bucketList.length > 0 && (
          <div className="mb-5 p-4 sm:p-5 rounded-[18px] bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-teal text-white shrink-0 shadow-[0_6px_14px_rgba(37,99,235,0.22)]">
                <Calculator className="size-5" />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-5 dark:text-slate-400">
                  Total Estimated Budget
                </div>
                <div className="font-display font-bold text-2xl leading-tight text-ink dark:text-white">
                  {totalBudgetPKR.toLocaleString()}{" "}
                  <span className="text-sm font-mono text-teal font-semibold">PKR</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 text-left sm:text-right font-mono text-xs text-muted-2 dark:text-slate-400">
              <div><span className="block mb-1 text-[10px] uppercase tracking-wider">Average / country</span><span className="font-bold text-ink dark:text-white">{Number(averageBudget).toLocaleString()} PKR</span></div>
              <div><span className="block mb-1 text-[10px] uppercase tracking-wider">Saved destinations</span><span className="font-bold text-ink dark:text-white">{bucketList.length}</span></div>
            </div>
          </div>
        )}

        {bucketList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-5 p-1.5 rounded-[16px] bg-slate-100/80 dark:bg-slate-800/80 border border-card-border dark:border-slate-700">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Filter saved places (e.g. A)…"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-11 pr-24 py-2.5 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-xl shadow-sm"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-muted-2"
                aria-label={`${displayCount} matching saved places`}
                title={`${displayCount} matching saved places`}
              >
                <Filter className="size-4" />
                <Badge size="sm">{displayCount}</Badge>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 px-2">
              <ArrowUpDown className="size-4 text-muted-2" />
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-transparent dark:border-slate-700 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer w-full sm:w-auto shadow-sm"
              >
                <option value="default">Sort: Recently Added</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
            </div>
          </div>
        )}

        {bucketList.length === 0 ? (
          <div className="p-7 sm:p-9 text-center rounded-[20px] bg-white dark:bg-slate-800 border border-dashed border-card-border dark:border-slate-700">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-700 text-teal">
              <Calculator className="size-5" />
            </div>
            <h3 className="font-display text-xl font-semibold text-ink dark:text-white">Your next adventure starts here</h3>
            <p className="mt-2 text-sm text-muted-1 dark:text-slate-400">Search for a country and add it to your travel collection.</p>
          </div>
        ) : filteredBucketList.length === 0 ? (
          <p className="p-8 text-center rounded-[22px] bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 text-muted-1 dark:text-slate-400 text-sm">
            No saved places starting with &ldquo;{searchQuery}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-lg text-ink dark:text-white m-0">
                  Delete all saved places?
                </h3>
                <p className="text-sm text-muted-1 dark:text-slate-300 m-0 leading-relaxed">
                  Are you sure you want to delete all the saved entries from your bucket list? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-card-border dark:border-slate-700/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-xl px-4 text-xs dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmClear}
                className="rounded-xl px-4 text-xs bg-rose-600 text-white hover:bg-rose-700 border-none"
              >
                Yes, Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}