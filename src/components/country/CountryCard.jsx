import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Converter from "@/components/country/Converter"
import { getCurrencySymbol, getFlagUrl } from "@/lib/utils"

/**
 * <CountryCard />
 * Purely presentational and reusable — it receives a country and a
 * callback, and has no idea where the data came from or where the
 * bucket list is stored. `mode="add"` on the search page,
 * `mode="remove"` on the list page.
 */
function CountryCard({ country, mode = "add", onAction }) {
  const { code, name, capital, currency } = country
  const currencySymbol = currency ? getCurrencySymbol(currency) : ""

  return (
    <Card className="card-hover">
      <CardContent>
        <Link
          to={`/country/${code}`}
          className="flex items-center gap-[14px] mb-4 no-underline text-inherit"
        >
          <img
            src={getFlagUrl(code)}
            alt={`Flag of ${name}`}
            className="w-16 h-11 object-cover rounded-lg bg-[#ede8de] shrink-0 shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
          />
          <div>
            <div className="font-display font-semibold text-[19px] tracking-[-0.01em]">
              {name}
            </div>
            <div className="font-mono text-xs text-muted-2 mt-0.5">
              {capital ?? "—"} · {currency} {currencySymbol}
            </div>
          </div>
        </Link>

        {currency && <Converter fromCurrency="PKR" toCurrency={currency} />}
      </CardContent>

      <CardFooter>
        {mode === "add" ? (
          <Button variant="add" onClick={() => onAction(country)}>
            <Plus className="size-[18px]" strokeWidth={3} />
            Add to my list
          </Button>
        ) : (
          <Button variant="remove" onClick={() => onAction(country)}>
            Remove from list
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default CountryCard
