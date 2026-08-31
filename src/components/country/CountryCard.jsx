import { useState } from "react"
import { Check, RefreshCw, StickyNote, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import Converter from "@/components/country/Converter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrencySymbol, getFlagUrl } from "@/lib/utils"
import { useBucketList } from "@/context/BucketListContext"

function CountryCard({ country, mode = "add", onUpdate, onRemove }) {
  const { updateCountryNote } = useBucketList()

  const [currentAmount, setCurrentAmount] = useState(country?.amount || "")
  const [note, setNote] = useState(country?.note || "")
  const [showNoteInput, setShowNoteInput] = useState(Boolean(country?.note))

  if (!country || !country.code) return null

  function handleBlurNote() {
    if (note !== country.note) {
      updateCountryNote(country.code, note)
    }
  }

  function handleSaveAmount() {
    onUpdate?.(country, currentAmount)
  }

  const isAmountChanged = String(currentAmount).trim() !== String(country.amount || "").trim()

  return (
    <Card className="rounded-[18px] bg-white dark:bg-slate-800 border-card-border dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <CardContent className="p-[18px] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/country/${country.code}`}
            className="flex items-center gap-3 no-underline group"
          >
            <img
              src={getFlagUrl(country.code)}
              alt={country.name || "Country flag"}
              className="w-12 h-9 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <h3 className="font-display font-semibold text-lg text-ink dark:text-white group-hover:text-teal m-0 transition-colors">
                {country.name}
              </h3>
              <p className="text-xs font-mono text-muted-2 dark:text-slate-400 m-0">
                {country.capital || "Capital N/A"}
              </p>
            </div>
          </Link>

          {country.currency && (
            <Badge size="sm">
              {country.currency} · {getCurrencySymbol(country.currency)}
            </Badge>
          )}
        </div>

        {country.currency && (
          <div className="space-y-2">
            <Converter
              key={`${country.code}-${country.amount}`}
              fromCurrency="PKR"
              toCurrency={country.currency}
              initialAmount={currentAmount}
              onAmountChange={(val) => setCurrentAmount(val)}
              onEnterPress={handleSaveAmount}
            />

            {isAmountChanged && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal/10 dark:bg-teal-950/40 border border-teal/30 animate-in fade-in duration-150">
                <span className="text-xs font-mono text-teal dark:text-teal-300 font-semibold">
                  Unsaved budget change!
                </span>
                <Button
                  size="sm"
                  onClick={handleSaveAmount}
                  className="bg-teal text-white hover:bg-teal/90 text-xs px-3 py-1 h-auto rounded-lg shadow-sm font-semibold"
                >
                  <Check className="size-3.5 mr-1" />
                  Save Update
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5 pt-1">
          {!showNoteInput ? (
            <button
              type="button"
              onClick={() => setShowNoteInput(true)}
              className="text-xs font-mono text-teal dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
            >
              <StickyNote className="size-3.5" />
              + Add travel note / places to visit
            </button>
          ) : (
            <div className="space-y-1">
              <label className="font-mono text-[10.5px] uppercase tracking-wider text-muted-5 dark:text-slate-400 flex items-center gap-1">
                <StickyNote className="size-3 text-teal" />
                Travel Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Visit Eiffel Tower, Try street food…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleBlurNote}
                className="w-full text-xs px-3 py-2 rounded-lg bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700 text-ink dark:text-white focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
          )}
        </div>

        {mode === "remove" && (
          <div className="pt-2 border-t border-card-border dark:border-slate-700/60 flex items-center justify-between gap-2">
            <Link
              to={`/country/${country.code}`}
              className="text-xs font-semibold text-teal dark:text-teal-300 hover:underline no-underline"
            >
              View Details &rarr;
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAmount}
                className={`text-xs px-2.5 py-1.5 h-auto transition-all ${
                  isAmountChanged
                    ? "bg-teal text-white hover:bg-teal/90 border-teal shadow-md font-bold"
                    : "text-slate-600 dark:text-slate-300 border-card-border dark:border-slate-700 hover:bg-surface-soft dark:hover:bg-slate-700"
                }`}
              >
                <RefreshCw className={`size-3 mr-1 ${isAmountChanged ? "animate-spin" : ""}`} />
                {isAmountChanged ? "Update Now" : "Update"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove?.(country)}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/80 px-2.5 py-1.5 h-auto"
              >
                <Trash2 className="size-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CountryCard