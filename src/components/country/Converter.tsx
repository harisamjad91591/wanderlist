import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Input } from "@/components/ui/input"
import { convertCurrency } from "@/lib/api"
import { cn } from "@/lib/utils"

/**
 * Visual size variants for the currency converter widget.
 */
export type ConverterSize = "sm" | "lg"

/**
 * Async request state for exchange rate fetching.
 */
export type ConversionStatus = "idle" | "loading" | "error"

/**
 * Props contract for the Converter component.
 */
export interface ConverterProps {
  /** Base currency code (Defaults to "PKR"). */
  fromCurrency?: string
  /** Target currency ISO code. */
  toCurrency: string
  /** Sizing variant controlling padding and font scale. */
  size?: ConverterSize
  /** Optional flag to render currency rate timestamp metadata. */
  showRateNote?: boolean
  /** Initial numeric string value. */
  initialAmount?: string
  /** Disables editing inputs when set to true. */
  readOnly?: boolean
  /** Callback function triggered on input value changes. */
  onAmountChange?: (value: string) => void
  /** Callback fired when pressing Enter key inside amount input. */
  onEnterPress?: () => void
  /** Automatically focuses amount input on mounting. */
  autoFocus?: boolean
}

/**
 * Inline currency conversion component with debounced API rate calculation and numeric validation.
 */
export default function Converter({
  fromCurrency = "PKR",
  toCurrency,
  size = "sm",
  showRateNote = false,
  initialAmount = "",
  readOnly = false,
  onAmountChange,
  onEnterPress,
  autoFocus = false,
}: ConverterProps) {
  const [amount, setAmount] = useState<string>(initialAmount)
  const [result, setResult] = useState<number | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [status, setStatus] = useState<ConversionStatus>("idle")
  const [inputError, setInputError] = useState<string>("")

  const inputRef = useRef<HTMLInputElement | null>(null)

  const numericAmount: number = Number(amount)
  const isValidAmount: boolean =
    amount !== "" && !Number.isNaN(numericAmount) && !inputError

  useEffect(() => {
    if (autoFocus && !readOnly) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [autoFocus, readOnly])

  /**
   * Handles user input with instant regex/number validation checks.
   */
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && onEnterPress && !inputError) {
      event.preventDefault()
      onEnterPress()
      inputRef.current?.blur()
    }
  }

  /**
   * Debounces API rate conversion requests by 400ms to eliminate redundant network overhead.
   */
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

  const isLg: boolean = size === "lg"

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