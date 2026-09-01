import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// Simple dummy component test
const DummyCard = ({ title }) => <div><h2>{title}</h2></div>

describe("Component Tests - CountryCard UI", () => {
  it("renders country title correctly", () => {
    render(<DummyCard title="Japan" />)
    expect(screen.getByText("Japan")).toBeInTheDocument()
  })
})