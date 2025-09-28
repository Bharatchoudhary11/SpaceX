# SpaceX Mission Explorer

A responsive React application that showcases SpaceX launch data from the public v4 API. Users can filter, search, paginate, and favorite launches, then inspect detailed mission info in an accessible modal.

## 🚀 Features
- Debounced search, launch year dropdown, success filter, and favorites-only toggle
- Favorites persisted locally with context-based state sharing
- Paginated grid (9 launches per page) with responsive layout and keyboard support
- Mission detail modal with patch imagery, rocket info, and external links (Wikipedia, Webcast, Article)
- Loading skeletons, error handling, and empty states to keep the UI resilient

## 🛠️ Tech Stack
- **React 19 + TypeScript** for component-driven UI and type safety
- **Vite** for fast dev server and bundling
- **Vitest + React Testing Library** for unit/integration tests in a JSDOM environment
- **Plain CSS** powered by modern layout primitives (grid, flex, clamp) for responsiveness

## 📦 Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the printed URL to explore the app (defaults to http://localhost:5173).
3. **Create a production build**
   ```bash
   npm run build
   ```
4. **Preview the production build (optional)**
   ```bash
   npm run preview
   ```

## ✅ Running Tests
Execute the Vitest suite (includes coverage for filtering, favorites, and mission detail modal):
```bash
npm run test
# or
npm run test:run
```

## 🔍 Project Structure Highlights
- `src/App.tsx` – Core page layout, data fetching, filters, pagination
- `src/components/` – Reusable UI pieces (cards, filters, modal, skeletons, pagination)
- `src/context/FavoritesContext.tsx` – Favorites state with localStorage persistence
- `src/api/spacex.ts` – Query helper for SpaceX launches
- `src/__tests__/App.test.tsx` – React Testing Library scenarios covering key behaviors

## ⚠️ Known Limitations
- Relies on client-side fetch; no SSR or caching layer, so initial load depends on SpaceX API latency
- No offline mode; favorites persist locally but launch data requires network access
- Pagination is client-side only—large result sets are filtered in memory after the initial fetch

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch and open a pull request

Feel free to extend filters, add routing for mission details, or introduce additional telemetry as future enhancements.
