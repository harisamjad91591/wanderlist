import { useEffect, useState } from "react"
import { ArrowLeft, Clock, CloudSun, Plus, StickyNote } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import Navbar from "@/components/layout/Navbar"
import Converter from "@/components/country/Converter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCountryByCode } from "@/lib/api"
import { getCurrencySymbol, getFlagUrl } from "@/lib/utils"
import { useBucketList } from "@/context/BucketListContext"

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted-5 mb-[3px]">
        {label}
      </div>
      <div className="text-[15px] font-semibold text-ink dark:text-white">
        {value ?? "—"}
      </div>
    </div>
  )
}

function CountryDetail({ code }) {
  const { bucketList, addCountry, updateCountryNote, removeCountry, isCountrySaved } = useBucketList()
  const [country, setCountry] = useState(null)
  const [status, setStatus] = useState("loading")
  const [localTime, setLocalTime] = useState("")

  const savedItem = bucketList.find((item) => item.code === code)
  const isSaved = isCountrySaved(code)

  const [amount, setAmount] = useState(savedItem?.amount || "")
  const [note, setNote] = useState(savedItem?.note || "")

  useEffect(() => {
    let cancelled = false
    setStatus("loading")

    getCountryByCode(code)
      .then((data) => {
        if (cancelled) return
        setCountry(data)
        setStatus(data ? "idle" : "error")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [code])

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  function handleAddOrUpdate() {
    if (!country) return
    const wasAlreadySaved = isCountrySaved(country.code)

    addCountry(country, amount)
    if (note) {
      updateCountryNote(country.code, note)
    }

    if (wasAlreadySaved) {
      toast.info(`${country.name}'s details updated in your list`)
    } else {
      toast.success(`${country.name} added to your list`)
    }
  }

  function handleRemove() {
    if (!country) return
    removeCountry(country.code)
    toast.info(`${country.name} removed from your list`)
  }

  if (status === "loading") {
    return (
      <div className="p-8 text-center font-mono text-sm text-muted-2 dark:text-slate-400">
        Loading country details…
      </div>
    )
  }

  if (status === "error" || !country) {
    return (
      <p className="text-remove-text-hover text-sm">
        Couldn&rsquo;t load that country. Go back and try another search.
      </p>
    )
  }

  return (
    <Card className="rounded-[20px] bg-white dark:bg-slate-800 border-card-border dark:border-slate-700 shadow-md">
      <CardContent className="p-[22px] space-y-6">
        <div className="result-body flex gap-6 flex-col sm:flex-row">
          <img
            src={getFlagUrl(country.code)}
            alt={`Flag of ${country.name}`}
            className="w-full sm:w-[230px] h-[154px] object-cover rounded-2xl bg-[#ede8de] shrink-0 shadow-[0_3px_10px_rgba(0,0,0,0.1)]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] m-0 text-ink dark:text-white">
                {country.name}
              </h2>
              {country.currency && (
                <Badge size="md">
                  {country.currency} · {getCurrencySymbol(country.currency)}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-6 my-[18px]">
              <Stat label="Capital" value={country.capital} />
              <Stat label="Continent" value={country.continent?.name} />
              <Stat
                label="Calling code"
                value={country.phone ? `+${country.phone}` : null}
              />
              <Stat
                label="Languages"
                value={country.languages?.map((lang) => lang.name).join(", ")}
              />
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700/60 font-mono text-xs text-muted-1 dark:text-slate-300 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal" />
                <span>Live Clock: <strong className="text-ink dark:text-white">{localTime || "12:00 PM"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudSun className="size-4 text-amber-500" />
                <span>Capital Weather: <strong className="text-ink dark:text-white">24°C Sunny</strong></span>
              </div>
            </div>
          </div>
        </div>

        {country.currency && (
          <div>
            <Converter
              key={`${country.code}-${savedItem?.amount || ''}`}
              fromCurrency="PKR"
              toCurrency={country.currency}
              size="lg"
              showRateNote
              autoFocus
              initialAmount={amount}
              onAmountChange={setAmount}
              onEnterPress={handleAddOrUpdate}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="font-mono text-xs uppercase tracking-wider text-muted-5 dark:text-slate-400 flex items-center gap-1.5">
            <StickyNote className="size-4 text-teal" />
            Personal Travel Notes / Places to Visit
          </label>
          <input
            type="text"
            placeholder="e.g. Visit Mount Fuji, try street food, buy souvenirs…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-sm px-4 py-3 rounded-xl bg-panel dark:bg-slate-900 border border-card-border dark:border-slate-700 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isSaved ? (
            <>
              <Button variant="add" onClick={handleAddOrUpdate}>
                Update details
              </Button>
              <Button variant="remove" onClick={handleRemove}>
                Remove from list
              </Button>
            </>
          ) : (
            <Button variant="add" onClick={handleAddOrUpdate}>
              <Plus className="size-[19px]" strokeWidth={3} />
              Add to my list
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CountryDetailPage() {
  const { code } = useParams()

  return (
    <div className="min-h-screen bg-panel dark:bg-slate-900 transition-colors">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <Link
          to="/"
          className="inline-flex items-center gap-[7px] no-underline text-sm font-semibold text-teal bg-teal-ghost dark:bg-slate-800 dark:text-teal-300 px-[14px] py-2 rounded-[10px] mt-5 mb-5 hover:bg-teal/10 transition-colors"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
          Back to search
        </Link>

        <CountryDetail key={code} code={code} />
      </div>
    </div>
  )
}

export default CountryDetailPage