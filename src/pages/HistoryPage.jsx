import { useState } from "react"
import { ChevronDown, ChevronUp, Clock, History, Trash2 } from "lucide-react"

import Navbar from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useBucketList } from "@/context/BucketListContext"

function CountryHistoryGroup({ countryName, items }) {
  const [isOpen, setIsOpen] = useState(false)

  const typeColors = {
    ADD: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
    UPDATE: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
    REMOVE: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
    NOTE: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
  }

  // Sab se latest activity items ke array mein pehli hoti hai
  const latestActivity = items[0]

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-200 hover:border-teal/50 shadow-sm">
      {/* Single Main Card (Click karne par dropdown open/close hota hai) */}
      <CardContent
        className="p-4 cursor-pointer select-none bg-white dark:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-semibold text-xl text-ink dark:text-white m-0">
              {countryName}
            </h3>
            <Badge size="sm" className="font-mono text-xs">
              {items.length} {items.length === 1 ? "activity" : "activities"}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-2 dark:text-slate-400 flex items-center gap-1">
              <Clock className="size-3.5" />
              Latest: {latestActivity?.timestamp}
            </span>
            <div className="p-1.5 rounded-lg bg-surface-soft dark:bg-slate-700 text-ink dark:text-white">
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
          </div>
        </div>

        {/* Dropdown / Accordion Body: Saare Sub-Cards is ke andar aate hain */}
        {isOpen && (
          <div
            className="mt-4 pt-4 border-t border-card-border dark:border-slate-700 space-y-3 animate-in fade-in-50"
            onClick={(e) => e.stopPropagation()} // Sub-card par click karne se dropdown band nahi hoga
          >
            <div className="font-mono text-xs uppercase tracking-wider text-muted-5 dark:text-slate-400 mb-2">
              Timeline History
            </div>
            {items.map((subItem) => (
              <div
                key={subItem.id}
                className="p-3.5 rounded-xl bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase shrink-0 border ${
                      typeColors[subItem.type] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subItem.type}
                  </span>
                  <p className="text-sm text-ink dark:text-slate-200 font-medium m-0">
                    {subItem.details}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-2 dark:text-slate-400 shrink-0 self-end sm:self-center">
                  {subItem.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function HistoryPage() {
  const { history, clearHistory } = useBucketList()

  // History ko Country Name ke mutabiq Group (Grouping) karna
  const groupedHistory = history.reduce((acc, item) => {
    const key = item.countryName || "General"
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})

  const countryKeys = Object.keys(groupedHistory)

  return (
    <div className="min-h-screen bg-panel dark:bg-slate-900 transition-colors">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <div className="flex items-center justify-between mt-6 mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <History className="size-6 text-teal" />
            <h2 className="font-display font-semibold text-[26px] tracking-[-0.01em] m-0 text-ink dark:text-white">
              Activity History
            </h2>
          </div>

          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:hover:bg-rose-950/80"
            >
              <Trash2 className="size-3.5 mr-1" />
              Clear Log
            </Button>
          )}
        </div>

        {countryKeys.length === 0 ? (
          <p className="text-muted-1 text-sm">No activity recorded yet.</p>
        ) : (
          <div>
            {countryKeys.map((countryName) => (
              <CountryHistoryGroup
                key={countryName}
                countryName={countryName}
                items={groupedHistory[countryName]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage