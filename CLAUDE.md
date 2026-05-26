# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, default port 5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test runner is configured. No linter is configured.

## Architecture

**Stack:** React 18 + React Router DOM v6 + Vite. No state management library, no backend, no API calls — all data is static.

**Single data source:** All trip content lives in `src/data/destinations.js` as a named export `destinations` (array of trip objects) plus a shared `tradeAirFlight` object. Every page that displays trips imports directly from this file. There is no database or CMS.

**Routing** (`src/App.jsx`):
| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Hero, destination grid, stats, newsletter |
| `/cerca` | `SearchResults` | Filters `destinations` by `?q=` query param |
| `/viatge/:id` | `TripDetail` | Looks up trip by `id` slug |
| `/reserva/:id` | `BookingPage` | Booking form for a trip |
| `/categoria/:cat` | `CategoryPage` | Filters by `category` field |
| `/contacte` | `ContactPage` | Contact form |
| `/avis-legal` | `AvisLegal` | Legal text |

`Navbar` and `Footer` are always rendered. `ScrollToTop` resets scroll position on route change.

**Trip data shape** (key fields in `destinations.js`):
- `id` — URL slug used in `/viatge/:id` and `/reserva/:id`
- `category` — `'europa'` or `'asia'` (used for filtering)
- `featured` — boolean, shows "Més popular" badge on home grid
- `price` / `priceIndividual` / `priceTriple` — `null` means "Preu a consultar"
- `taxesIncluded` — if `true`, taxes are included in `price`; otherwise `taxesAereas` is added separately
- `departures` — array of `{ date, status?, supplement?, noAirQuota?, note? }`. Newer trips use ISO `YYYY-MM-DD` dates and a `status` string (`'OPEN'`, `'CLOSED'`, `'GUARANTEED'`); older Iceland trips use `DD/MM` strings with `supplement` and `noAirQuota` booleans
- `bookingOptions` — optional object `{ circuitAndFlight, circuitOnly, flightOnly }` with status strings, used for Slovenia/Croatia trips
- `flight` — optional reference to `tradeAirFlight` for the BCN–Ljubljana direct flight

**CSS:** Each component and page has a co-located `.css` file. No CSS framework — all styles are custom. Global styles in `src/index.css` and `src/App.css`. Shared utility classes include `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--sm`, `.container`, `.fade-in`/`.visible` (IntersectionObserver scroll animation), `section-tag`, `section-title`.

**Language:** The entire UI is in Catalan.

## Key patterns

- To add a new trip: add an entry to the `destinations` array in `src/data/destinations.js` with a unique `id`. It will automatically appear in the home grid, search results, and be accessible at `/viatge/<id>`.
- `formatDate()` in `TripDetail.jsx` normalises both date formats (`YYYY-MM-DD` → `DD/MM`; `DD/MM` passes through).
- The newsletter form in `Home.jsx` is client-side only (no submission endpoint — `setSent(true)` simulates success).
- The hero search form navigates to `/cerca?q=<value>` on submit.
