// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useBucketListStore, useBucketList } from "../useBucketListStore"

describe("useBucketListStore Unit Tests", () => {
  beforeEach(() => {
    act(() => {
      useBucketListStore.setState({
        bucketList: [],
        history: [],
        searchQuery: "",
        sortBy: "default",
      })
    })
  })

  it("should add a country with initial budget to the store", () => {
    const mockCountry = { code: "JP", name: "Japan", currency: "JPY" }

    act(() => {
      useBucketListStore.getState().addCountry(mockCountry, "50000")
    })

    const { bucketList } = useBucketListStore.getState()
    expect(bucketList).toHaveLength(1)
    expect(bucketList[0].code).toBe("JP")
    expect(bucketList[0].amount).toBe("50000")
  })

  it("should update personal travel notes", () => {
    const mockCountry = { code: "FR", name: "France" }

    act(() => {
      useBucketListStore.getState().addCountry(mockCountry, "2000")
      useBucketListStore.getState().updateCountryNote("FR", "Visit Eiffel Tower")
    })

    const { bucketList } = useBucketListStore.getState()
    expect(bucketList[0].note).toBe("Visit Eiffel Tower")
  })

  it("should remove a country from the bucket list", () => {
    const mockCountry = { code: "TR", name: "Turkey" }

    act(() => {
      useBucketListStore.getState().addCountry(mockCountry, "1500")
      useBucketListStore.getState().removeCountry("TR")
    })

    const { bucketList } = useBucketListStore.getState()
    expect(bucketList).toHaveLength(0)
  })

  it("should compute budget total and filtered list in useBucketList hook", () => {
    const mockCountry = { code: "AE", name: "UAE" }

    act(() => {
      useBucketListStore.getState().addCountry(mockCountry, "30000")
    })

    const { result } = renderHook(() => useBucketList())
    expect(result.current.totalBudgetPKR).toBe(30000)
    expect(result.current.displayCount).toBe(1)
  })
})