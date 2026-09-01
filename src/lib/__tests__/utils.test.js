import { describe, it, expect } from "vitest"

describe("Unit Tests - Basic Logic", () => {
  it("should perform standard calculations or string checks", () => {
    const formatCountryName = (name) => name.trim().toUpperCase()
    expect(formatCountryName(" pakistan ")).toBe("PAKISTAN")
  })
})