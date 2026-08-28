import { useState } from "react"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Converter from "@/components/country/Converter"
import { getCurrencySymbol, getFlagUrl } from "@/lib/utils"
import { useBucketList } from "@/context/BucketListContext"

function CountryCard({
  country,
  mode = "add",
  onAction,
  onUpdate,
  onRemove,
  autoFocus = false,
}) {
  const { code, name, capital, currency } = country
  const currencySymbol = currency ? getCurrencySymbol(currency) : ""
  const [amount, setAmount] = useState(country.amount ?? "")

  const { isCountrySaved } = useBucketList()
  const isSaved = isCountrySaved(code)

  const numericAmount = Number(amount)
  const isValidAmount =
    !currency || (amount.toString().trim() !== "" && !Number.isNaN(numericAmount) && numericAmount > 0)

  const handleSaveOrUpdate = () => {
    if (!isValidAmount) return
    if (mode === "add") {
      onAction?.(country, amount)
    } else {
      onUpdate ? onUpdate(country, amount) : onAction?.(country, amount)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(country)
    } else {
      onAction?.(country)
    }
  }

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

        {currency && (
          <Converter
            fromCurrency="PKR"
            toCurrency={currency}
            initialAmount={country.amount ?? ""}
            onAmountChange={setAmount}
            onEnterPress={handleSaveOrUpdate}
            autoFocus={autoFocus}
          />
        )}
      </CardContent>

      <CardFooter className={mode === "remove" ? "flex flex-col gap-2" : ""}>
        {mode === "add" ? (
          <Button
            variant="add"
            disabled={!isValidAmount}
            onClick={handleSaveOrUpdate}
          >
            <Plus className="size-[18px]" strokeWidth={3} />
            {isSaved ? "Update in my list" : "Add to my list"}
          </Button>
        ) : (
          <>
            <Button
              variant="add"
              disabled={!isValidAmount}
              onClick={handleSaveOrUpdate}
            >
              Update amount
            </Button>
            <Button variant="remove" onClick={handleRemove}>
              Remove from list
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default CountryCard