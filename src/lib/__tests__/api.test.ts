import { afterEach, describe, expect, it, vi } from "vitest"

import { convertCurrency, searchCountries } from "@/lib/api"

describe("API runtime validation", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("normalizes a valid country response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            objects: [
              {
                codes: { alpha_2: "PK" },
                names: { common: "Pakistan" },
                capitals: [{ name: "Islamabad" }],
              },
            ],
          },
        }),
        { status: 200 }
      )
    )

    await expect(searchCountries("Pakistan")).resolves.toEqual([
      { code: "PK", name: "Pakistan", capital: "Islamabad", languages: [] },
    ])
  })

  it("rejects a country response with invalid field types", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ data: { objects: [{ codes: { alpha_2: 92 } }] } }),
        { status: 200 }
      )
    )

    await expect(searchCountries("Pakistan")).rejects.toThrow(
      "Invalid countries API response"
    )
  })

  it("rejects an exchange-rate response without a numeric rate", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ rate: "not-a-number" }), { status: 200 })
    )

    await expect(
      convertCurrency({ amount: "100", from: "PKR", to: "USD" })
    ).rejects.toThrow("Conversion unavailable for PKR → USD")
  })
})