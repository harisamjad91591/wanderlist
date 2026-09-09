// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { describe, it, expect } from "vitest"
import CountryCard from "../CountryCard"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

function renderWithProviders(ui) {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe("CountryCard Component Tests", () => {
  const mockCountry = {
    code: "JP",
    name: "Japan",
    capital: "Tokyo",
    currency: "JPY",
    amount: "1000",
  }

  it("renders country details correctly", () => {
    renderWithProviders(<CountryCard country={mockCountry} />)

    expect(screen.getByText("Japan")).toBeInTheDocument()
    expect(screen.getByText("Tokyo")).toBeInTheDocument()
  })
})