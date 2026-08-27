import { useEffect, useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
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
      <div className="text-[15px] font-semibold">{value ?? "—"}</div>
    </div>
  )
}

// Split out so `key={code}` on the wrapper below forces a full remount
// whenever the route param changes — that resets `status` back to its
// "loading" initial value for free, instead of calling setState
// synchronously inside the effect (which React's lint rules flag).
function CountryDetail({ code }) {
  const { addCountry } = useBucketList()
  const [country, setCountry] = useState(null)
  const [status, setStatus] = useState("loading") // loading | idle | error

  useEffect(() => {
    let cancelled = false

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

  function handleAdd() {
    addCountry(country)
    toast.success(`${country.name} added to your list`)
  }

  if (status === "loading") {
    return <p className="text-muted-1 text-sm">Loading…</p>
  }

  if (status === "error" || !country) {
    return (
      <p className="text-remove-text-hover text-sm">
        Couldn&rsquo;t load that country. Go back and try another search.
      </p>
    )
  }

  return (
    <Card className="rounded-[20px]">
      <CardContent className="p-[22px]">
        <div className="result-body flex gap-6 flex-col sm:flex-row">
          <img
            src={getFlagUrl(country.code)}
            alt={`Flag of ${country.name}`}
            className="w-full sm:w-[230px] h-[154px] object-cover rounded-2xl bg-[#ede8de] shrink-0 shadow-[0_3px_10px_rgba(0,0,0,0.1)]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] m-0">
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
          </div>
        </div>

        {country.currency && (
          <div className="mt-5">
            <Converter
              fromCurrency="PKR"
              toCurrency={country.currency}
              size="lg"
              showRateNote
            />
          </div>
        )}

        <Button variant="add" className="mt-4" onClick={handleAdd}>
          <Plus className="size-[19px]" strokeWidth={3} />
          Add to my list
        </Button>
      </CardContent>
    </Card>
  )
}

function CountryDetailPage() {
  const { code } = useParams()

  return (
    <div className="min-h-screen bg-panel">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <Navbar />

        <Link
          to="/"
          className="inline-flex items-center gap-[7px] no-underline text-sm font-semibold text-teal bg-teal-ghost px-[14px] py-2 rounded-[10px] mt-5 mb-5 hover:bg-teal/10 transition-colors"
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
