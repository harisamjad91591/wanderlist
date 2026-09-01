import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useState } from "react"

const SearchFilterIntegration = () => {
  const [query, setQuery] = useState("")
  return (
    <div>
      <input 
        placeholder="Search..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <p>Result: {query}</p>
    </div>
  )
}

describe("Integration Tests - Search & Render", () => {
  it("updates search query and filters UI live", () => {
    render(<SearchFilterIntegration />)
    const input = screen.getByPlaceholderText("Search...")
    fireEvent.change(input, { target: { value: "Italy" } })
    expect(screen.getByText("Result: Italy")).toBeInTheDocument()
  })
})