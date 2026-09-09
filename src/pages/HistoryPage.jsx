import { useState } from "react"
import { ChevronDown, ChevronUp, History, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useBucketList } from "@/store/useBucketListStore"

function HistoryPage() {
  const { history, clearHistory } = useBucketList()
  const [openCountries, setOpenCountries] = useState({})

  function handleClearHistory() {
    clearHistory()
    toast.info("Activity history log cleared")
  }

  // Click karne par dropdown toggle (Show / Hide) karna
  function toggleDropdown(countryName) {
    setOpenCountries((prev) => ({
      ...prev,
      [countryName]: !prev[countryName],
    }))
  }

  // Same country ki multiple entries ko group karna
  const groupedHistoryMap = history.reduce((acc, log) => {
    const name = log.countryName || "General Activity"
    if (!acc[name]) {
      acc[name] = []
    }
    acc[name].push(log)
    return acc
  }, {})

  // Grouped entries list
  const groupedHistoryList = Object.keys(groupedHistoryMap).map((countryName) => ({
    countryName,
    logs: groupedHistoryMap[countryName],
    latestTimestamp: groupedHistoryMap[countryName][0]?.timestamp,
  }))

  return (
    <div className="min-h-screen bg-panel dark:bg-slate-900 transition-colors">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <div className="flex items-center justify-between gap-3 mt-5 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-semibold text-[26px] tracking-[-0.01em] m-0 text-ink dark:text-white">
              Activity History
            </h2>
            <Badge size="md">{history.length} logs</Badge>
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:hover:bg-rose-950/80"
            >
              <Trash2 className="size-3.5 mr-1" />
              Clear Log
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-muted-1 text-sm">
            No activity history yet. Actions like adding, updating, or removing countries will be logged here.
          </p>
        ) : (
          <div className="space-y-4">
            {groupedHistoryList.map(({ countryName, logs, latestTimestamp }) => {
              const isOpen = Boolean(openCountries[countryName])

              return (
                <div
                  key={countryName}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-card-border dark:border-slate-700 shadow-sm overflow-hidden transition-all"
                >
                  {/* Single Accordion Card Header (Click to Open/Close) */}
                  <button
                    type="button"
                    onClick={() => toggleDropdown(countryName)}
                    className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-ghost dark:bg-slate-700 text-teal dark:text-teal-300 shrink-0">
                        <History className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold text-base text-ink dark:text-white m-0">
                            {countryName}
                          </h3>
                          <Badge size="sm" className="font-mono text-[11px] bg-teal/10 text-teal dark:bg-teal-950 dark:text-teal-300 border-none">
                            {logs.length} {logs.length === 1 ? "activity" : "activities"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-2 dark:text-slate-400 m-0 mt-0.5 font-mono">
                          Latest update: {latestTimestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-muted-2 dark:text-slate-400">
                      <span className="text-xs font-semibold hidden sm:inline">
                        {isOpen ? "Hide Details" : "View History"}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="size-5 text-teal" />
                      ) : (
                        <ChevronDown className="size-5" />
                      )}
                    </div>
                  </button>

                  {/* Dropdown Content - List of all activities for this country */}
                  {isOpen && (
                    <div className="border-t border-card-border dark:border-slate-700/60 bg-panel/50 dark:bg-slate-900/40 p-4 space-y-3 animate-in fade-in duration-200">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-card-border/70 dark:border-slate-700/70 shadow-2xs flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                size="sm"
                                className={`font-mono text-[10px] uppercase border-none ${
                                  log.type === "ADD"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : log.type === "UPDATE"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : log.type === "NOTE"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                }`}
                              >
                                {log.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-ink dark:text-slate-200 m-0 font-medium">
                              {log.details}
                            </p>
                          </div>

                          <span className="font-mono text-[10.5px] text-muted-2 dark:text-slate-400 shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage