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

  const inputRef = useRef(null)
  const numericAmount = Number(amount)
  const isValidAmount = amount !== "" && !Number.isNaN(numericAmount)

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
    onAmountChange?.(value)
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && onEnterPress) {
      event.preventDefault()
      onEnterPress()
      inputRef.current?.blur() // Enter press hote hi focus input field se bahar chala jaye ga
    }
  }

  useEffect(() => {
    if (!toCurrency || !isValidAmount) {
      return
    }

    const timeoutId = setTimeout(() => {
      setStatus("loading")
      convertCurrency({ amount: numericAmount, from: fromCurrency, to: toCurrency })
        .then((data) => {
          setResult(data.result)
          setRateDate(data.date)
          setStatus("idle")
        })
        .catch(() => {
          setResult(null)
          setStatus("error")
        })
    }, 400)

    return () => clearTimeout(timeoutId)
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
        <Input
          ref={inputRef}
          className={cn(
            isLg
              ? "amount-input font-mono font-bold text-[17px] text-ink w-[120px] px-[13px] py-[11px]"
              : "amount-input font-mono font-bold text-[15px] text-ink w-[88px] px-[11px] py-[9px] rounded-[9px]",
            readOnly && "bg-surface-soft text-muted-2 cursor-default"
          )}
          value={amount}
          onChange={handleAmountChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
        />
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
          {status !== "error" && result !== null && (
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
          {status === "loading" && result === null && (
            <span className="font-mono text-[13px] text-muted-5">…</span>
          )}
        </div>
      </div>

      {showRateNote && rateDate && (
        <div className="text-[11.5px] text-muted-6 mt-[11px]">
          Rate as of {rateDate} · Frankfurter
        </div>
      )}
    </div>
  )
}

export default Converter