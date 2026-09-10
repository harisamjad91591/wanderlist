import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

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
  const [result, setResult] = useState(null)
  const [rateDate, setRateDate] = useState(null)
  const [status, setStatus] = useState("idle")
  const [inputError, setInputError] = useState("")

  const inputRef = useRef(null)

  const numericAmount = Number(amount)
  const isValidAmount = amount !== "" && !Number.isNaN(numericAmount) && !inputError

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

  useEffect(() => {
    if (!toCurrency || !isValidAmount) {
      setResult(null)
      setStatus("idle")
      return
    }

    let cancelled = false
    setStatus("loading")

    const timeoutId = setTimeout(() => {
      convertCurrency({ amount: numericAmount, from: fromCurrency, to: toCurrency })
        .then((data) => {
          if (cancelled) return
          setResult(data.result)
          setRateDate(data.date)
          setStatus("idle")
        })
        .catch(() => {
          if (cancelled) return
          setResult(null)
          setStatus("error")
        })
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [numericAmount, isValidAmount, fromCurrency, toCurrency])

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
          {status === "error" && (
            <span className="font-mono text-[13px] text-remove-text-hover">
              Rate unavailable
            </span>
          )}
          {status !== "error" && result !== null && !inputError && (
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
          {status === "loading" && (
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