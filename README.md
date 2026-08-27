# Wanderlist — Static Design

Bun + Vite + React + Tailwind CSS v4 + shadcn-style UI primitives + React Router DOM + react-toastify + lucide-react.

This is the **static design only** — pages render with mock data (`src/lib/mockData.js`).
No state management, no live API calls yet — that's for you to wire up.

## Run it

```bash
bun install
bun dev
```

Build:

```bash
bun run build
```

## Reusable components

- `src/components/layout/Navbar.jsx` — identical navbar on every page, active link handled by `react-router-dom`'s `NavLink`.
- `src/components/country/SearchBar.jsx` — the search input + button, used once on the Search page.
- `src/components/country/CountryCard.jsx` — one component, two looks via `mode="add" | "remove"`. Renders a nested `<Converter />`.
- `src/components/country/Converter.jsx` — the "What's my money worth?" box, used compact inside cards and full-width (`size="lg"`) on the country detail page.
- `src/components/ui/*` — shadcn-style primitives (`Button`, `Input`, `Badge`) built with `cva` + `cn()`, themed to the Wanderlist palette in `src/index.css`.

## Routes

- `/` — Search page
- `/list` — My Bucket List
- `/country/:code` — Country detail (`code` looks up `src/lib/mockData.js`)

## APIs picked out for you (not yet wired up)

- **REST Countries** (`restcountries.com`) — country data, free, no key.
- **Frankfurter** (`api.frankfurter.dev`) — currency conversion (ECB rates), free, no key.

See `src/lib/api.js` for stub functions with the exact endpoints commented in.
