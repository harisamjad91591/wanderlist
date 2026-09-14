import { useState } from "react"
import { Check, MapPin, RefreshCw, StickyNote, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import Converter from "@/components/country/Converter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrencySymbol, getFlagUrl } from "@/lib/utils"
import { useBucketList } from "@/store/useBucketListStore"
import type { Country } from "@/types"

/**
 * Display modes supported by the CountryCard component.
 */
export type CardMode = "add" | "remove"

/**
 * Props contract for the CountryCard component.
 */
export interface CountryCardProps {
  /** Country entity extended with optional budget allocation and travel notes. */
  country: Country & { amount?: string; note?: string }
  /** Card behavior mode: "add" for search view or "remove" for bucket list page. */
  mode?: CardMode
  /** Callback fired when user triggers budget persistence. */
  onUpdate?: (country: Country, amount: string) => void
  /** Callback fired when user removes the country from saved places. */
  onRemove?: (country: Country) => void
}

/**
 * CountryCard renders individual country metrics, currency conversion, note inputs, and management actions.
 */
export default function CountryCard({
  country,
  mode = "add",
  onUpdate,
  onRemove,
}: CountryCardProps) {
  const { updateCountryNote } = useBucketList()

  const [currentAmount, setCurrentAmount] = useState<string>(country?.amount || "")
  const [note, setNote] = useState<string>(country?.note || "")
  const [showNoteInput, setShowNoteInput] = useState<boolean>(Boolean(country?.note))

  if (!country || !country.code) return null

  const handleBlurNote = (): void => {
    if (note !== country.note) {
      updateCountryNote(country.code, note)
    }
  }

  const handleSaveAmount = (): void => {
    onUpdate?.(country, currentAmount)
  }

  /**
   * Persists travel note on Enter key down and releases DOM focus.
   */
  const handleKeyDownNote = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlurNote()
      e.currentTarget.blur()
    }
  }

  const isAmountChanged: boolean =
    String(currentAmount).trim() !== String(country.amount || "").trim()

  return (
    <Card className="card-hover group overflow-hidden rounded-[20px] bg-white dark:bg-slate-800 border-card-border dark:border-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-blue-200 dark:hover:border-slate-600 flex flex-col justify-between">
      <CardContent className="p-0 space-y-0">
        {/* Header Flag & Info */}
        <div className="flex items-start justify-between gap-3 p-5 bg-gradient-to-br from-blue-50/80 via-white to-white dark:from-slate-700/50 dark:via-slate-800 dark:to-slate-800 border-b border-card-border dark:border-slate-700">
          <Link
            to={`/country/${country.code}`}
            state={{
              flagUrl: getFlagUrl(country.code),
              countryName: country.name,
            }}
            className="flex items-center gap-3 no-underline group"
          >
            <div className="relative shrink-0">
              <img
                src={getFlagUrl(country.code)}
                alt={country.name || "Country flag"}
                className="w-12 h-9 object-cover rounded-lg shadow-sm ring-1 ring-black/5 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-2 -right-2 rounded-full bg-white dark:bg-slate-900 border border-card-border dark:border-slate-700 px-1.5 py-0.5 text-[9px] font-mono font-bold text-muted-2 dark:text-slate-300">
                {country.code}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-lg leading-tight text-ink dark:text-white group-hover:text-teal m-0 transition-colors truncate">
                {country.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs font-mono text-muted-2 dark:text-slate-400 m-0 truncate">
                <MapPin className="size-3 text-teal shrink-0" />
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

        <div className="p-5 space-y-4">
          {/* Converter Field */}
          {country.currency && (
            <div className="space-y-2">
              <Converter
                key={`${country.code}-${country.amount}`}
                fromCurrency="PKR"
                toCurrency={country.currency}
                initialAmount={currentAmount}
                onAmountChange={(val: string) => setCurrentAmount(val)}
                onEnterPress={handleSaveAmount}
              />

              {isAmountChanged && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-teal/10 dark:bg-teal-950/40 border border-teal/30 animate-in fade-in duration-150">
                  <span className="text-xs font-mono text-teal dark:text-teal-300 font-semibold">
                    Unsaved budget change!
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSaveAmount}
                    className="bg-teal text-white hover:bg-teal/90 text-xs px-3 py-1 h-auto rounded-lg shadow-sm font-semibold shrink-0"
                  >
                    <Check className="size-3.5 mr-1" />
                    Save Update
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Travel Notes Section */}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
                  onBlur={handleBlurNote}
                  onKeyDown={handleKeyDownNote}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {mode === "remove" && (
          <div className="px-5 py-3.5 border-t border-card-border dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/30 flex items-center justify-between gap-2">
            <Link
              to={`/country/${country.code}`}
              state={{
                flagUrl: getFlagUrl(country.code),
                countryName: country.name,
              }}
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