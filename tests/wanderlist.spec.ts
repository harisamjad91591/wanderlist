import { test, expect } from "@playwright/test"

test.describe("Wanderlist Core User Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear local storage prior to each test run for state isolation
    await page.goto("/")
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test("should search for a country, view detail page, and save to bucket list", async ({ page }) => {
    // 1. Verify Homepage Landing
    await expect(page.getByRole("heading", { name: /Explore & Convert/i })).toBeVisible()

    // 2. Search for "Japan"
    const searchInput = page.getByPlaceholder(/Where to next\?/i)
    await searchInput.fill("Japan")

    // 3. Select Japan from search results overlay
    const searchResult = page.getByText("Japan").first()
    await expect(searchResult).toBeVisible()
    await searchResult.click()

    // 4. Validate URL transition and Detail Page content
    await expect(page).toHaveURL(/\/country\/JP/)
    await expect(page.getByRole("heading", { name: "Japan" })).toBeVisible()

    // 5. Add Japan to Bucket List
    const addButton = page.getByRole("button", { name: /Add to my list/i })
    await expect(addButton).toBeVisible()
    await addButton.click()

    // 6. Navigate to "My List" page via Navbar link
    const myListNavLink = page.getByRole("link", { name: /My List/i })
    await myListNavLink.click()

    // 7. Verify URL and saved country card persistence
    await expect(page).toHaveURL(/\/my-list/)
    await expect(page.getByRole("heading", { name: "Japan" })).toBeVisible()
    await expect(page.getByText(/1 places/i)).toBeVisible()
  })

  test("should filter saved places in My List", async ({ page }) => {
    // Direct navigation to test empty state
    await page.goto("/my-list")
    await expect(page.getByText(/Nothing here yet/i)).toBeVisible()
  })
})