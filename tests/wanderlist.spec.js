import { test, expect } from "@playwright/test"

test("homepage loads correctly and displays Wanderlist title", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("Wanderlist")).toBeVisible()
})

test("theme customizer popover opens on button click", async ({ page }) => {
  await page.goto("/")
  const themeButton = page.getByRole("button", { name: "Theme Customizer" })
  await themeButton.click()
  await expect(page.getByText("Appearance")).toBeVisible()
})