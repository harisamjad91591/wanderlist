import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { convertCurrency } from "@/lib/api"
import { cn } from "@/lib/utils"

function Converter({
  fromCurrency = "PKR",
  toCurrency,
  size = "sm",
  showRateNote = false,
  initialAmount = "",
  readOnly = false,
  onAmountChange,
  onEnterPress,
  autoFocus = false,
}) {
  const [amount, setAmount] = useState(initialAmount)
  const [inputError, setInputError] = useState("")

  const inputRef = useRef(null)

  const numericAmount = Number(amount)
  const isValidAmount = amount !== "" && !Number.isNaN(numericAmount) && !inputError

  const { data, isLoading, isError } = useQuery({
    queryKey: ["convertCurrency", fromCurrency, toCurrency, numericAmount],
    queryFn: () => convertCurrency({ amount: numericAmount, from: fromCurrency, to: toCurrency }),
    enabled: Boolean(toCurrency && isValidAmount),
  })

  const result = data?.result ?? null
  const rateDate = data?.date ?? null

  useEffect(() => {
    if (autoFocus && !readOnly) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [autoFocus, readOnly])

  function handleAmountChange(event) {
    const value = event.target.value
    setAmount(value)

    if (value !== "" && Number.isNaN(Number(value))) {
      setInputError("Only numbers are allowed")
    } else if (Number(value) < 0) {
      setInputError("Amount cannot be negative")
    } else {
      setInputError("")
    }

    onAmountChange?.(value)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && onEnterPress && !inputError) {
      event.preventDefault()
      onEnterPress()
      inputRef.current?.blur()
    }
  }

  const isLg = size === "lg"

  return (
    <div
      className={
        isLg
          ? "bg-converter-bg border border-converter-border rounded-[14px] px-[18px] py-4"
          : "bg-converter-bg border border-converter-border rounded-[13px] p-[14px]"
      }
    >
      <div
        className={
          isLg
            ? "font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted-5 mb-[11px]"
            : "font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted-5 mb-[9px]"
        }
      >
        What&rsquo;s my money worth?
      </div>

      <div className="flex items-center gap-[10px] flex-wrap">
        <div className="flex flex-col">
          <Input
            ref={inputRef}
            className={cn(
              isLg
                ? "amount-input font-mono font-bold text-[17px] text-ink w-[120px] px-[13px] py-[11px]"
                : "amount-input font-mono font-bold text-[15px] text-ink w-[88px] px-[11px] py-[9px] rounded-[9px]",
              readOnly && "bg-surface-soft text-muted-2 cursor-default",
              inputError && "border-remove-text-hover focus:ring-remove-text-hover"
            )}
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
          />
        </div>

        <span className="font-mono text-[13px] text-muted-2 font-bold">
          {fromCurrency}
        </span>
        <ArrowRight className="size-[17px] text-[#c6bfb1]" strokeWidth={2.5} />
        <div className="flex-1 text-right min-w-[120px]">
          {isError && (
            <span className="font-mono text-[13px] text-remove-text-hover">
              Rate unavailable
            </span>
          )}
          {!isError && result !== null && !inputError && (
            <>
              <span
                className={
                  isLg
                    ? "font-mono font-bold text-[26px] text-teal"
                    : "font-mono font-bold text-xl text-teal"
                }
              >
                {result.toFixed(2)}
              </span>
              <span className="font-mono text-[13px] text-muted-2 font-bold ml-1">
                {toCurrency}
              </span>
            </>
          )}
          {isLoading && (
            <span className="font-mono text-[13px] text-muted-5">…</span>
          )}
        </div>
      </div>

      {inputError && (
        <div className="font-mono text-[11.5px] text-remove-text-hover mt-2 font-semibold">
          ⚠️ {inputError}
        </div>
      )}

      {showRateNote && rateDate && !inputError && (
        <div className="text-[11.5px] text-muted-6 mt-[11px]">
          Rate as of {rateDate} · Frankfurter
        </div>
      )}
    </div>
  )
}

export default Converter